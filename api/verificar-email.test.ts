import { describe, expect, it } from "vitest";
import { dominioRecibeCorreo } from "./verificar-email";

// Usa DNS real: requiere conexión a internet.
describe("dominioRecibeCorreo", () => {
  it("acepta dominios que reciben correo", async () => {
    expect(await dominioRecibeCorreo("gmail.com")).toBe(true);
  });

  it("rechaza dominios que no existen", async () => {
    expect(await dominioRecibeCorreo("gmaill-no-existe-insside-xyz.com")).toBe(false);
  });
});
