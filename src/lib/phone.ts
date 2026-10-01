import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/mobile";

export interface Pais {
  iso: CountryCode;
  nombre: string;
  code: string;
  flag: string;
}

/** Los más comunes entre la audiencia de Insside: van primero en el selector. */
const PRIORIDAD: CountryCode[] = [
  "US",
  "MX",
  "CO",
  "VE",
  "AR",
  "CL",
  "PE",
  "EC",
  "ES",
  "PA",
  "CR",
  "DO",
];

function flagOf(iso: string): string {
  return String.fromCodePoint(...[...iso].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

const nombres = (() => {
  try {
    return new Intl.DisplayNames(["es"], { type: "region" });
  } catch {
    return null;
  }
})();

function nombreDe(iso: string): string {
  try {
    return nombres?.of(iso) ?? iso;
  } catch {
    return iso;
  }
}

const todos: Pais[] = getCountries().map((iso) => ({
  iso,
  nombre: nombreDe(iso),
  code: `+${getCountryCallingCode(iso)}`,
  flag: flagOf(iso),
}));

export const PAISES_DESTACADOS: Pais[] = PRIORIDAD.map((iso) => todos.find((p) => p.iso === iso)!);

/** Todos los países, en orden alfabético (en español). */
export const PAISES: Pais[] = [...todos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

export function paisPorIso(iso: string): Pais {
  return todos.find((p) => p.iso === iso) ?? PAISES_DESTACADOS[0];
}

/** Sin tildes y en minúsculas, para buscar "peru" y encontrar "Perú". */
export function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function buscarPaises(q: string): Pais[] {
  const n = normalizar(q).replace(/^\+/, "");
  if (!n) return PAISES;
  return PAISES.filter(
    (p) =>
      normalizar(p.nombre).includes(n) ||
      p.iso.toLowerCase() === n ||
      p.code.slice(1).startsWith(n),
  );
}

/** País por defecto según la región del navegador (fallback US). */
export function defaultCountry(): CountryCode {
  try {
    const region = navigator.language.split("-")[1]?.toUpperCase();
    return todos.find((p) => p.iso === region)?.iso ?? "US";
  } catch {
    return "US";
  }
}

/** "+584121234567" o "" si no se puede interpretar. Acepta el formato nacional (0412…). */
export function whatsappE164(iso: string, local: string): string {
  if (!local.replace(/\D/g, "")) return "";
  return parsePhoneNumberFromString(local, iso as CountryCode)?.number ?? "";
}

/** true solo si es un número de celular válido para ese país. */
export function isValidWhatsapp(iso: string, local: string): boolean {
  return isValidPhoneNumber(local, iso as CountryCode);
}

/** Da formato mientras se escribe: "4121234567" → "412-1234567". */
export function formatLocal(iso: string, local: string): string {
  return new AsYouType(iso as CountryCode).input(local);
}
