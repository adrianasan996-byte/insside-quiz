import type { AnxietyType, SeverityLevelKey, Specialist } from "../types";

export const WHATSAPP_NUMBER = "17866356816";
export const INSSIDE_ESPECIALISTAS_URL = "https://www.insside.co/profesionales-main";
export const INSSIDE_EXPLORATORIA_URL = "https://www.insside.co/profesionales-main";

/** Perfil de cada especialista en la web: insside.co/profesionales/<slug> */
export const perfilUrl = (slug: string) => `https://www.insside.co/profesionales/${slug}`;

/** Datos tomados de la web (insside-web/lib/specialists.ts). Blanca (nutrición) no aplica a ansiedad. */
export const SPECIALISTS = {
  valentina: {
    slug: "valentina-tello",
    nombre: "Valentina Tello",
    rol: "Psicóloga Clínica",
    precioUSD: 57,
    enfoque: "Terapia cognitivo-conductual: ansiedad, autoestima, límites y hábitos.",
    iniciales: "VT",
    color: "#8B9970",
    tipo: "psicologia",
  },
  luisa: {
    slug: "luisa-reyes",
    nombre: "Luisa Reyes",
    rol: "Psicóloga & Coach Ontológica",
    precioUSD: 57,
    enfoque: "Gestalt + coaching: gestión emocional, ansiedad, autoestima y autoconfianza.",
    iniciales: "LR",
    color: "#64C1C4",
    tipo: "psicologia",
  },
  paty: {
    slug: "paty-romero",
    nombre: "Paty Romero",
    rol: "Psicóloga – Bioneuroemoción & PNL",
    precioUSD: 115,
    enfoque: "Regulación emocional, conflictos emocionales inconscientes y heridas de la infancia.",
    iniciales: "PR",
    color: "#AB6139",
    tipo: "psicologia",
  },
  barbara: {
    slug: "barbara-serrano",
    nombre: "Barbara Serrano",
    rol: "Life Coach Ontológica",
    precioUSD: 68,
    enfoque: "Autoexigencia, manejo de la ansiedad, límites y amor propio.",
    iniciales: "BS",
    color: "#C2A24A",
    tipo: "coaching",
  },
  daniela: {
    slug: "daniela-pena",
    nombre: "Daniela Peña",
    rol: "Coach en Transformación Emocional",
    precioUSD: 68,
    enfoque: "Ansiedad, autosabotaje, patrones limitantes y trabajo de sombra.",
    iniciales: "DP",
    color: "#E3812F",
    tipo: "coaching",
  },
  steph: {
    slug: "steph-de-gregorio",
    nombre: "Steph De Gregorio",
    rol: "Life Coach & Co-fundadora de Insside",
    precioUSD: 111,
    enfoque: "Claridad, propósito, metas profesionales y transiciones de vida.",
    iniciales: "SD",
    color: "#B5BC8F",
    tipo: "coaching",
  },
  malena: {
    slug: "malena-lum",
    nombre: "Malena Lum",
    rol: "Health Coach Holística",
    precioUSD: 79,
    enfoque: "Conexión cuerpo-mente, bienestar emocional y hábitos saludables.",
    iniciales: "ML",
    color: "#8B9970",
    tipo: "coaching",
  },
} satisfies Record<string, Specialist>;

export type SpecialistKey = keyof typeof SPECIALISTS;

/**
 * Pool por patrón. Se muestran 2 al azar para repartir los leads entre todas.
 * Mantener sincronizado con api/lead.ts (api/lead.test.ts falla si se desalinean).
 */
export const POOL_BY_TYPE: Record<
  AnxietyType,
  { psicologia: SpecialistKey[]; coaching: SpecialistKey[] }
> = {
  rumia: { psicologia: ["valentina", "paty", "luisa"], coaching: ["daniela", "steph"] },
  control: { psicologia: ["luisa", "valentina", "paty"], coaching: ["daniela", "steph"] },
  social: { psicologia: ["luisa", "valentina", "paty"], coaching: ["barbara", "daniela"] },
  rendimiento: { psicologia: ["valentina", "luisa", "paty"], coaching: ["barbara", "steph"] },
  somatica: { psicologia: ["paty", "valentina", "luisa"], coaching: ["malena"] },
};

/** En sobrecarga o alarma solo se recomiendan psicólogas, nunca coaches. */
export const SOLO_PSICOLOGIA: readonly SeverityLevelKey[] = ["sobrecarga", "alarma"];

function pickOne<T>(arr: readonly T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

/**
 * Elige 2 especialistas: psicóloga + coach (calma/alerta) o dos psicólogas
 * distintas (sobrecarga/alarma). Primero va siempre una psicóloga.
 */
export function pickSpecialists(
  type: AnxietyType,
  level: SeverityLevelKey,
  rand: () => number = Math.random,
): [Specialist, Specialist] {
  const pool = POOL_BY_TYPE[type];
  const first = pickOne(pool.psicologia, rand);
  const second = SOLO_PSICOLOGIA.includes(level)
    ? pickOne(
        pool.psicologia.filter((k) => k !== first),
        rand,
      )
    : pickOne(pool.coaching, rand);
  return [SPECIALISTS[first], SPECIALISTS[second]];
}

/** Link de WhatsApp con mensaje pre-llenado según el resultado. */
export function whatsappLink(opts: {
  especialista: string;
  perfil: string;
  nivel: string;
  nombre?: string;
}): string {
  const saludo = opts.nombre ? `Hola, soy ${opts.nombre}. ` : "Hola. ";
  const msg =
    `${saludo}Hice el test de ansiedad de Insside y mi resultado fue ` +
    `"${opts.perfil}" (nivel: ${opts.nivel}). ` +
    `Me gustaría agendar una sesión con ${opts.especialista} o que me ayuden a elegir especialista.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
