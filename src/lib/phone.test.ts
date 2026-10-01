import { describe, expect, it } from "vitest";
import { buscarPaises, isValidWhatsapp, whatsappE164 } from "./phone";

describe("isValidWhatsapp", () => {
  it("acepta celulares válidos, con o sin 0 inicial", () => {
    expect(isValidWhatsapp("VE", "0412 123 4567")).toBe(true);
    expect(isValidWhatsapp("VE", "412-1234567")).toBe(true);
    expect(isValidWhatsapp("CO", "300 123 4567")).toBe(true);
    expect(isValidWhatsapp("MX", "55 1234 5678")).toBe(true);
    expect(isValidWhatsapp("ES", "612 345 678")).toBe(true);
  });

  it("rechaza números incompletos, fijos o de otro país", () => {
    expect(isValidWhatsapp("VE", "412123")).toBe(false);
    expect(isValidWhatsapp("VE", "212 123 4567")).toBe(false); // fijo de Caracas
    expect(isValidWhatsapp("ES", "912 345 678")).toBe(false); // fijo de Madrid
    expect(isValidWhatsapp("CO", "0412 123 4567")).toBe(false);
    expect(isValidWhatsapp("US", "")).toBe(false);
  });
});

describe("whatsappE164", () => {
  it("normaliza al formato internacional", () => {
    expect(whatsappE164("VE", "0412-123.4567")).toBe("+584121234567");
    expect(whatsappE164("US", "")).toBe("");
  });
});

describe("buscarPaises", () => {
  it("busca por nombre sin tildes, código o ISO", () => {
    expect(buscarPaises("peru").map((p) => p.iso)).toContain("PE");
    expect(buscarPaises("+58").map((p) => p.iso)).toContain("VE");
    expect(buscarPaises("espa").map((p) => p.iso)).toContain("ES");
    expect(buscarPaises("mx").map((p) => p.iso)).toContain("MX");
  });
});
