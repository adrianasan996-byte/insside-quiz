import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import handler, { buildWebhookPayload, parseLead } from "./lead";

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
    const l = parseLead({ ...valid, puntaje: 999, subescalas: { rumia: -5 } })!;
    expect(l.puntaje).toBe(100);
    expect(l.subescalas.rumia).toBe(0);
  });
});

describe("buildWebhookPayload", () => {
  it("genera campos planos y tags de whitelist", () => {
    const p = buildWebhookPayload(parseLead(valid)!, "2026-01-01T00:00:00.000Z");
    expect(p).toMatchObject({
      first_name: "Ana",
      last_name: "Pérez López",
      email: "ana@ejemplo.com",
      phone: "+584121234567",
      source: "test-ansiedad",
      perfil: "Ansiedad rumiante",
      perfil_key: "rumia",
      nivel: "Sobre-alerta",
      nivel_key: "alerta",
      puntaje: 40,
      score_rumia: 78,
      requiere_apoyo: "no",
      especialista_recomendado: "Valentina Tello",
      tags: "quiz-ansiedad,ansiedad-rumia,nivel-alerta",
    });
  });

  it("omite claves de contacto vacías y agrega tag de apoyo", () => {
    const p = buildWebhookPayload(
      parseLead({ ...valid, nombre: "", email: "", showSupport: true })!,
    );
    expect(p).not.toHaveProperty("first_name");
    expect(p).not.toHaveProperty("email");
    expect(p.requiere_apoyo).toBe("si");
    expect(p.tags).toContain("quiz-requiere-apoyo");
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

  it("502 si el webhook falla, sin filtrar detalles", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, text: async () => "secret detail" });
    const res = makeRes();
    await handler({ method: "POST", body: valid }, res);
    expect(res.code).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });
});
