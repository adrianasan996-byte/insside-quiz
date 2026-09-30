import type { AnxietyType } from "../types";

/** Ilustraciones de marca Insside (carpeta public/brand/ilustraciones). */
export const ILLUSTRATION = {
  abrazo: "/brand/ilustraciones/abrazo.png",
  pensamientos: "/brand/ilustraciones/pensamientos.png",
  pensando: "/brand/ilustraciones/pensando.png",
  nublado: "/brand/ilustraciones/nublado.png",
  dialogo: "/brand/ilustraciones/dialogo.png",
  brote: "/brand/ilustraciones/brote.png",
  apoyo: "/brand/ilustraciones/apoyo.png",
} as const;

/** Una ilustración por patrón de ansiedad. */
export const TYPE_ILLUSTRATION: Record<AnxietyType, string> = {
  rumia: ILLUSTRATION.pensamientos,
  control: ILLUSTRATION.pensando,
  social: ILLUSTRATION.dialogo,
  rendimiento: ILLUSTRATION.pensando,
  somatica: ILLUSTRATION.nublado,
};
