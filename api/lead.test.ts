import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler, {
  NIVELES,
  PERFILES,
  TEXTO_NIVEL,
  TEXTO_PERFIL,
  buildWebhookPayload,
  parseLead,
} from "./lead";
import { LEVEL_COPY, RESULTS } from "../src/data/results";
import { SEVERITY_LEVELS } from "../src/lib/scoring";

const WEBHOOK = "https://example.test/hooks/abc";

function makeRes() {
  const res = {
    code: 0,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    status(c: number) {
      res.code = c;
      return res;
    },
    json(b: unknown) {
      res.body = b;
    },
    setHeader(k: string, v: string) {
      res.headers[k] = v;
    },
  };
  return res;
}

const valid = {
  nombre: "Ana Pérez López",
  email: "Ana@Ejemplo.com ",
  whatsapp: "+58 412-123 4567",
  perfilKey: "rumia",
  nivelKey: "alerta",
  puntaje: 40,
  subescalas: { rumia: 78, control: 67, social: 25, rendimiento: 25, somatica: 25 },
  showSupport: false,
};

/** parseLead de un lead completo, con el tipo ya acotado. */
function completo(raw: unknown) {
  const l = parseLead(raw);
  if (!l || l.estado !== "completo") throw new Error("se esperaba un lead completo");
  return l;
}

describe("parseLead", () => {
  it("normaliza email y whatsapp", () => {
    const l = parseLead(valid)!;
    expect(l.email).toBe("ana@ejemplo.com");
    expect(l.whatsapp).toBe("+584121234567");
  });

  it("acepta solo email o solo whatsapp, pero no ninguno", () => {
    expect(parseLead({ ...valid, whatsapp: "" })).not.toBeNull();
    expect(parseLead({ ...valid, email: "" })).not.toBeNull();
    expect(parseLead({ ...valid, email: "", whatsapp: "" })).toBeNull();
  });

  it("rechaza email o teléfono mal formados", () => {
    expect(parseLead({ ...valid, email: "nope" })).toBeNull();
    expect(parseLead({ ...valid, whatsapp: "123" })).toBeNull();
    expect(parseLead({ ...valid, whatsapp: "4121234567" })).toBeNull(); // sin +código
  });

  it("rechaza perfil o nivel fuera de la whitelist", () => {
    expect(parseLead({ ...valid, perfilKey: "hack" })).toBeNull();
    expect(parseLead({ ...valid, nivelKey: "x" })).toBeNull();
  });

  it("limpia caracteres de control y limita el largo del nombre", () => {
    const l = parseLead({ ...valid, nombre: "  Ana\u0000\n" + "x".repeat(200) })!;
    expect(l.nombre).not.toMatch(/\p{Cc}/u);
    expect(l.nombre.length).toBeLessThanOrEqual(80);
  });

  it("acota puntajes a 0-100", () => {
    const l = completo({ ...valid, puntaje: 999, subescalas: { rumia: -5 } });
    expect(l.puntaje).toBe(100);
    expect(l.subescalas.rumia).toBe(0);
  });

  it("sin estado se asume completo (clientes viejos en caché)", () => {
    expect(parseLead(valid)!.estado).toBe("completo");
  });

  it("parcial solo exige contacto, no resultado", () => {
    const l = parseLead({ estado: "parcial", nombre: "Ana", email: "ana@ejemplo.com" });
    expect(l).toEqual({
      estado: "parcial",
      nombre: "Ana",
      apellido: "",
      email: "ana@ejemplo.com",
      whatsapp: "",
    });
    expect(parseLead({ estado: "parcial", nombre: "Ana" })).toBeNull();
    expect(parseLead({ estado: "parcial", email: "nope" })).toBeNull();
  });
});

describe("buildWebhookPayload", () => {
  it("genera campos planos y tags de whitelist", () => {
    const p = buildWebhookPayload(completo(valid), "2026-01-01T00:00:00.000Z");
    expect(p).toMatchObject({
      first_name: "Ana",
      last_name: "Pérez López",
      email: "ana@ejemplo.com",
      phone: "+584121234567",
      source: "test-ansiedad",
      perfil: "Patrón rumiante",
      perfil_key: "rumia",
      nivel: "Sobre-alerta",
      nivel_key: "alerta",
      puntaje: 40,
      score_rumia: 78,
      requiere_apoyo: "no",
      especialista_recomendado: "Valentina Tello",
      estado: "completo",
      tags: "quiz-ansiedad,quiz-completado,ansiedad-rumia,nivel-alerta",
    });
  });

  it("usa nombre y apellido tal cual cuando vienen separados", () => {
    const p = buildWebhookPayload(
      completo({ ...valid, nombre: "Ana María", apellido: " Pérez López\n" }),
    );
    expect(p).toMatchObject({ first_name: "Ana María", last_name: "Pérez López" });
  });

  it("parcial: solo contacto + tag de incompleto, sin campos de resultado", () => {
    const p = buildWebhookPayload(
      parseLead({ ...valid, estado: "parcial" })!,
      "2026-01-01T00:00:00.000Z",
    );
    expect(p).toEqual({
      first_name: "Ana",
      last_name: "Pérez López",
      email: "ana@ejemplo.com",
      phone: "+584121234567",
      source: "test-ansiedad",
      estado: "parcial",
      tags: "quiz-ansiedad,quiz-incompleto",
      fecha: "2026-01-01T00:00:00.000Z",
    });
  });

  it("incluye los textos del resultado para el correo", () => {
    const p = buildWebhookPayload(completo(valid));
    expect(p.perfil_descripcion).toBe(RESULTS.rumia.reconocimiento);
    expect(p.nivel_titulo).toBe(LEVEL_COPY.alerta.headline);
    expect(p.nivel_mensaje).toBe(LEVEL_COPY.alerta.parrafo);
    expect(p.herramienta).toBe(RESULTS.rumia.herramientas[0].nombre);
    expect(p.herramienta_como).toBe(RESULTS.rumia.herramientas[0].como);
  });

  it("omite claves de contacto vacías y agrega tag de apoyo", () => {
    const p = buildWebhookPayload(completo({ ...valid, nombre: "", email: "", showSupport: true }));
    expect(p).not.toHaveProperty("first_name");
    expect(p).not.toHaveProperty("email");
    expect(p.requiere_apoyo).toBe("si");
    expect(p.tags).toContain("quiz-requiere-apoyo");
  });
});

describe("sincronía con el contenido del sitio", () => {
  it("perfiles y textos coinciden con src/data/results.ts", () => {
    for (const k of Object.keys(PERFILES) as (keyof typeof PERFILES)[]) {
      expect(PERFILES[k]).toBe(RESULTS[k].titulo);
      expect(TEXTO_PERFIL[k].descripcion).toBe(RESULTS[k].reconocimiento);
      expect(TEXTO_PERFIL[k].herramienta).toBe(RESULTS[k].herramientas[0].nombre);
      expect(TEXTO_PERFIL[k].herramientaComo).toBe(RESULTS[k].herramientas[0].como);
    }
  });

  it("niveles coinciden con scoring.ts y LEVEL_COPY", () => {
    for (const l of SEVERITY_LEVELS) {
      expect(NIVELES[l.key]).toBe(l.label);
      expect(TEXTO_NIVEL[l.key]).toEqual({
        titulo: LEVEL_COPY[l.key].headline,
        mensaje: LEVEL_COPY[l.key].parrafo,
      });
    }
  });
});

describe("handler", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    process.env.GHL_WEBHOOK_URL = WEBHOOK;
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.GHL_WEBHOOK_URL;
    delete process.env.GHL_WEBHOOK_URL_PARCIAL;
  });

  it("405 si no es POST", async () => {
    const res = makeRes();
    await handler({ method: "GET" }, res);
    expect(res.code).toBe(405);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("500 si falta la variable de entorno", async () => {
    delete process.env.GHL_WEBHOOK_URL;
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.code).toBe(500);
  });

  it("400 con datos inválidos y no llama al CRM", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: { ...valid, email: "", whatsapp: "" } }, res);
    expect(res.code).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reenvía el payload al webhook y responde 200", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => "" });
    const res = makeRes();
    await handler({ method: "POST", body: JSON.stringify(valid) }, res);
    expect(res.code).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(WEBHOOK);
    expect(JSON.parse(init.body)).toMatchObject({ email: "ana@ejemplo.com", perfil_key: "rumia" });
  });

  it("parcial sin GHL_WEBHOOK_URL_PARCIAL: 200 y no llama a ningún webhook", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: { ...valid, estado: "parcial" } }, res);
    expect(res.code).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("parcial va solo al webhook de parciales, nunca al de resultados", async () => {
    process.env.GHL_WEBHOOK_URL_PARCIAL = "https://example.test/hooks/parcial";
    fetchMock.mockResolvedValue({ ok: true, status: 200, text: async () => "" });
    const res = makeRes();
    await handler({ method: "POST", body: { ...valid, estado: "parcial" } }, res);
    expect(res.code).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://example.test/hooks/parcial");
  });

  it("502 si el webhook falla, sin filtrar detalles", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => "secret detail" });
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.code).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });
});
