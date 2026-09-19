/**
 * Endpoint serverless (Vercel) que recibe el lead del quiz, lo valida y lo
 * reenvía al webhook de GoHighLevel (trigger "Inbound Webhook" de un workflow).
 *
 * La URL del webhook vive solo en la variable de entorno GHL_WEBHOOK_URL del
 * servidor: nunca llega al navegador ni al repo.
 *
 * Este archivo es autocontenido a propósito (sin imports de ../src) para no
 * depender de cómo Vercel resuelve módulos ESM en las funciones.
 * Referencia de campos: ver README → "Integración con GoHighLevel".
 */

interface Req {
  method?: string;
  body?: unknown;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

// Mantener sincronizado con src/types.ts, src/lib/scoring.ts y src/data/specialists.ts
const PERFILES = {
  rumia: "Ansiedad rumiante",
  control: "Ansiedad anticipatoria",
  social: "Ansiedad social",
  rendimiento: "Ansiedad de rendimiento",
  somatica: "Ansiedad somática",
} as const;

const NIVELES = {
  calma: "Calma vigilante",
  alerta: "Sobre-alerta",
  sobrecarga: "Sobrecarga",
  alarma: "Señal de alarma",
} as const;

const ESPECIALISTA: Record<PerfilKey, string> = {
  rumia: "Valentina Tello",
  somatica: "Valentina Tello",
  social: "Valentina Tello",
  control: "Luisa Reyes",
  rendimiento: "Barbara Serrano",
};

type PerfilKey = keyof typeof PERFILES;
type NivelKey = keyof typeof NIVELES;

interface Lead {
  nombre: string;
  email: string;
  whatsapp: string;
  perfilKey: PerfilKey;
  nivelKey: NivelKey;
  puntaje: number;
  subescalas: Record<PerfilKey, number>;
  showSupport: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+\d{8,15}$/;

function pct(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n)
    ? Math.min(100, Math.max(0, Math.round(n)))
    : 0;
}

/** Valida el body. Nada del cliente pasa al CRM sin whitelist ni límites. */
export function parseLead(raw: unknown): Lead | null {
  let body = raw;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) return null;

  const whatsapp = typeof b.whatsapp === "string" ? b.whatsapp.replace(/[^\d+]/g, "") : "";
  if (whatsapp && !PHONE_RE.test(whatsapp)) return null;

  // Sin forma de contactar a la persona no hay nada que guardar en el CRM.
  if (!email && !whatsapp) return null;

  if (typeof b.perfilKey !== "string" || !(b.perfilKey in PERFILES)) return null;
  if (typeof b.nivelKey !== "string" || !(b.nivelKey in NIVELES)) return null;

  const nombre =
    typeof b.nombre === "string" ? b.nombre.replace(/\p{Cc}/gu, "").trim().slice(0, 80) : "";

  const s = (b.subescalas && typeof b.subescalas === "object" ? b.subescalas : {}) as Record<
    string,
    unknown
  >;
  const subescalas = {
    rumia: pct(s.rumia),
    control: pct(s.control),
    social: pct(s.social),
    rendimiento: pct(s.rendimiento),
    somatica: pct(s.somatica),
  };

  return {
    nombre,
    email,
    whatsapp,
    perfilKey: b.perfilKey as PerfilKey,
    nivelKey: b.nivelKey as NivelKey,
    puntaje: pct(b.puntaje),
    subescalas,
    showSupport: b.showSupport === true,
  };
}

/** Payload plano que recibe GoHighLevel (claves en snake_case para mapear fácil). */
export function buildWebhookPayload(lead: Lead, fecha = new Date().toISOString()) {
  const [firstName, ...rest] = lead.nombre.split(/\s+/).filter(Boolean);
  const perfil = PERFILES[lead.perfilKey];
  const nivel = NIVELES[lead.nivelKey];

  const tags = ["quiz-ansiedad", `ansiedad-${lead.perfilKey}`, `nivel-${lead.nivelKey}`];
  if (lead.showSupport) tags.push("quiz-requiere-apoyo");

  const resumen = [
    "Test de ansiedad (test.insside.co)",
    `Perfil dominante: ${perfil}`,
    `Nivel: ${nivel} (${lead.puntaje}/100)`,
    `Desglose: ${(Object.keys(PERFILES) as PerfilKey[])
      .map((k) => `${PERFILES[k]} ${lead.subescalas[k]}%`)
      .join(" · ")}`,
    `Especialista sugerido: ${ESPECIALISTA[lead.perfilKey]}`,
    lead.showSupport ? "⚠️ Marcó señales que ameritan seguimiento pronto." : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    // Contacto (se omiten los vacíos para no borrar datos existentes en GHL)
    ...(firstName ? { first_name: firstName } : {}),
    ...(rest.length ? { last_name: rest.join(" ") } : {}),
    ...(lead.email ? { email: lead.email } : {}),
    ...(lead.whatsapp ? { phone: lead.whatsapp } : {}),
    source: "test-ansiedad",
    // Resultado
    perfil,
    perfil_key: lead.perfilKey,
    nivel,
    nivel_key: lead.nivelKey,
    puntaje: lead.puntaje,
    score_rumia: lead.subescalas.rumia,
    score_control: lead.subescalas.control,
    score_social: lead.subescalas.social,
    score_rendimiento: lead.subescalas.rendimiento,
    score_somatica: lead.subescalas.somatica,
    requiere_apoyo: lead.showSupport ? "si" : "no",
    especialista_recomendado: ESPECIALISTA[lead.perfilKey],
    // Ayudas para el workflow
    tags: tags.join(","),
    resumen,
    fecha,
  };
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] Falta GHL_WEBHOOK_URL en el entorno");
    return res.status(500).json({ error: "CRM no configurado" });
  }

  const lead = parseLead(req.body);
  if (!lead) return res.status(400).json({ error: "Datos inválidos" });

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWebhookPayload(lead)),
    });
    if (!r.ok) {
      console.error("[lead] GHL webhook error:", r.status, await r.text().catch(() => ""));
      return res.status(502).json({ error: "No se pudo guardar en el CRM" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] Error enviando a GHL:", err);
    return res.status(502).json({ error: "No se pudo guardar en el CRM" });
  }
}
