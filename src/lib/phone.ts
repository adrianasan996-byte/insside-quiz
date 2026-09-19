export interface Pais {
  iso: string;
  code: string;
  flag: string;
}

/** Códigos de marcación más comunes entre la audiencia hispanohablante de Insside. */
export const PAISES: Pais[] = [
  { iso: "US", code: "+1", flag: "🇺🇸" },
  { iso: "MX", code: "+52", flag: "🇲🇽" },
  { iso: "CO", code: "+57", flag: "🇨🇴" },
  { iso: "VE", code: "+58", flag: "🇻🇪" },
  { iso: "AR", code: "+54", flag: "🇦🇷" },
  { iso: "CL", code: "+56", flag: "🇨🇱" },
  { iso: "PE", code: "+51", flag: "🇵🇪" },
  { iso: "EC", code: "+593", flag: "🇪🇨" },
  { iso: "ES", code: "+34", flag: "🇪🇸" },
  { iso: "PA", code: "+507", flag: "🇵🇦" },
  { iso: "CR", code: "+506", flag: "🇨🇷" },
  { iso: "GT", code: "+502", flag: "🇬🇹" },
  { iso: "HN", code: "+504", flag: "🇭🇳" },
  { iso: "SV", code: "+503", flag: "🇸🇻" },
  { iso: "NI", code: "+505", flag: "🇳🇮" },
  { iso: "UY", code: "+598", flag: "🇺🇾" },
  { iso: "PY", code: "+595", flag: "🇵🇾" },
  { iso: "BO", code: "+591", flag: "🇧🇴" },
  { iso: "CU", code: "+53", flag: "🇨🇺" },
  { iso: "DO", code: "+1", flag: "🇩🇴" },
];

/** Código por defecto según el idioma/región del navegador (fallback +1). */
export function defaultDialCode(): string {
  try {
    const region = navigator.language.split("-")[1]?.toUpperCase();
    return PAISES.find((p) => p.iso === region)?.code ?? "+1";
  } catch {
    return "+1";
  }
}

function localDigits(local: string): string {
  // Solo dígitos y sin ceros a la izquierda (muchos escriben el formato nacional: 0412…)
  return local.replace(/\D/g, "").replace(/^0+/, "");
}

/** "+584121234567" o "" si no hay número. */
export function whatsappE164(code: string, local: string): string {
  const digits = localDigits(local);
  return digits ? `${code}${digits}` : "";
}

/** Vacío es válido (el campo es opcional); si hay número, debe ser plausible. */
export function isValidWhatsapp(code: string, local: string): boolean {
  const e164 = whatsappE164(code, local);
  if (!e164) return true;
  return /^\+\d{8,15}$/.test(e164) && localDigits(local).length >= 6;
}
