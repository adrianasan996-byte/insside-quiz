import { describe, expect, it } from "vitest";
import { EMAIL_RE, sugerirEmail } from "./email";

describe("sugerirEmail", () => {
  it("corrige errores de tipeo comunes", () => {
    expect(sugerirEmail("ana@gmial.com")).toBe("ana@gmail.com");
    expect(sugerirEmail("ana@gmail.con")).toBe("ana@gmail.com");
    expect(sugerirEmail("ana@gmai.com")).toBe("ana@gmail.com");
    expect(sugerirEmail("ana@gmailcom")).toBe("ana@gmail.com");
    expect(sugerirEmail("ana@hotmial.com")).toBe("ana@hotmail.com");
    expect(sugerirEmail("ana@hotmail.co")).toBe("ana@hotmail.com");
    expect(sugerirEmail("Ana@Outlok.com")).toBe("ana@outlook.com");
    expect(sugerirEmail("ana@yaho.com")).toBe("ana@yahoo.com");
    expect(sugerirEmail("ana@icloud.cmo")).toBe("ana@icloud.com");
  });

  it("no toca dominios correctos ni de empresa", () => {
    expect(sugerirEmail("ana@gmail.com")).toBeNull();
    expect(sugerirEmail("ana@hotmail.es")).toBeNull();
    expect(sugerirEmail("ana@mail.com")).toBeNull();
    expect(sugerirEmail("ana@insside.co")).toBeNull();
    expect(sugerirEmail("ana@empresa.com.ve")).toBeNull();
    expect(sugerirEmail("ana@gmx.com")).toBeNull();
    expect(sugerirEmail("sin-arroba")).toBeNull();
  });
});

describe("EMAIL_RE", () => {
  it("valida el formato", () => {
    expect(EMAIL_RE.test("ana@gmail.com")).toBe(true);
    expect(EMAIL_RE.test("ana@gmail")).toBe(false);
    expect(EMAIL_RE.test("ana@gmail.c")).toBe(false);
    expect(EMAIL_RE.test("ana gmail.com")).toBe(false);
  });
});
