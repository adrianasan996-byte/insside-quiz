import type { AnxietyType, Specialist } from "../types";

export const WHATSAPP_NUMBER = "17866356816";
export const INSSIDE_ESPECIALISTAS_URL = "https://www.insside.co/profesionales-main";
export const INSSIDE_EXPLORATORIA_URL = "https://www.insside.co/profesionales-main";

export const SPECIALISTS: Record<string, Specialist> = {
  valentina: {
    slug: "valentina-tello",
    nombre: "Valentina Tello",
    rol: "Psicóloga",
    precioUSD: 57,
    enfoque: "Ansiedad, autoestima, límites y procesos de transformación personal.",
    iniciales: "VT",
    color: "#8B9970",
  },
  luisa: {
    slug: "luisa-reyes",
    nombre: "Luisa Reyes",
    rol: "Psicóloga · Coaching ontológico",
    precioUSD: 57,
    enfoque: "Manejo emocional, ansiedad anticipatoria, autoestima y trauma.",
    iniciales: "LR",
    color: "#64C1C4",
  },
  barbara: {
    slug: "barbara-serrano",
    nombre: "Barbara Serrano",
    rol: "Life Coach",
    precioUSD: 68,
    enfoque: "Autoexigencia, perfeccionismo, límites y autoamor.",
    iniciales: "BS",
    color: "#C2A24A",
  },
};

/** Qué especialista se recomienda según el tipo primario de ansiedad. */
export const SPECIALIST_BY_TYPE: Record<AnxietyType, keyof typeof SPECIALISTS> = {
  rumia: "valentina",
  somatica: "valentina",
  social: "valentina",
  control: "luisa",
  rendimiento: "barbara",
};

export function specialistFor(type: AnxietyType): Specialist {
  return SPECIALISTS[SPECIALIST_BY_TYPE[type]];
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
