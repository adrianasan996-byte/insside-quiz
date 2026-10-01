/**
 * Comprueba que el dominio de un correo (?dominio=gmail.com) exista y pueda recibir emails
 * (registros MX en DNS). Lo usa el formulario de contacto del quiz para
 * avisar de errores como "ana@gmaill.com" antes de enviar. Solo recibe el
 * dominio, nunca el correo completo.
 *
 * Responde { valido: false } solo cuando el DNS confirma que el dominio no
 * existe o no recibe correo. Ante cualquier duda (timeout, error de red)
 * responde { valido: true } para no bloquear a nadie por un fallo nuestro.
 */
import { promises as dns } from "node:dns";

interface Req {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

const DOMINIO_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const NO_EXISTE = new Set(["ENOTFOUND", "ENODATA", "NXDOMAIN"]);

function conTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

export async function dominioRecibeCorreo(dominio: string): Promise<boolean> {
  try {
    const mx = await conTimeout(dns.resolveMx(dominio), 3000);
    // MX nulo (RFC 7505): el dominio declara que no recibe correo.
    return mx.some((r) => r.exchange && r.exchange !== ".");
  } catch (err) {
    const code = (err as { code?: string }).code ?? "";
    if (!NO_EXISTE.has(code)) return true;
    // Sin MX pero con dirección: por RFC 5321 aún puede recibir correo.
    try {
      const a = await conTimeout(dns.resolve(dominio), 3000);
      return a.length > 0;
    } catch (e) {
      return !NO_EXISTE.has((e as { code?: string }).code ?? "");
    }
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const raw = req.query?.dominio;
  const dominio = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim().toLowerCase();
  if (!DOMINIO_RE.test(dominio)) {
    return res.status(200).json({ valido: false });
  }
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  return res.status(200).json({ valido: await dominioRecibeCorreo(dominio) });
}
