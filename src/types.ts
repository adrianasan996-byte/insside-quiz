export type AnxietyType =
  | "rumia"
  | "control"
  | "social"
  | "rendimiento"
  | "somatica";

/**
 * Valor de una respuesta en la escala tipo GAD-7 (0-3):
 * 0 = Ningún día … 3 = Casi todos los días.
 */
export type LikertValue = 0 | 1 | 2 | 3;

export interface LikertOption {
  value: LikertValue;
  label: string;
  /** Rango de días que representa la opción, p.ej. "Me pasó entre 1 y 5 días." */
  days: string;
}

export interface Question {
  id: string;
  /** A qué sección pertenece (índice de SECTIONS). */
  section: number;
  text: string;
  /**
   * Subescala a la que suma la respuesta. `null` = solo suma a la
   * severidad global (impacto funcional / afrontamiento), no a un tipo.
   */
  type: AnxietyType | null;
  /** Peso del ítem al calcular la severidad global. Default 1. */
  weight?: number;
  /** Marca ítems de pánico/alarma para el flag de apoyo. */
  panicFlag?: boolean;
}

export interface Section {
  /** Número mostrado al usuario (1-indexed). */
  index: number;
  key: string;
  title: string;
  tagline: string;
  /** Encabezado que precede a las preguntas de la sección. */
  prompt: string;
}

export type Answers = Record<string, LikertValue>;

export type SeverityLevelKey = "calma" | "alerta" | "sobrecarga" | "alarma";

export interface SeverityLevel {
  key: SeverityLevelKey;
  label: string;
  /** Rango [min, max] inclusivo sobre 0-100. */
  range: [number, number];
}

export interface ScoreResult {
  /** Severidad global 0-100. */
  total: number;
  level: SeverityLevel;
  /** Porcentaje 0-100 por subescala. */
  subscales: Record<AnxietyType, number>;
  /** Subescalas ordenadas de mayor a menor. */
  ranked: AnxietyType[];
  primary: AnxietyType;
  secondary: AnxietyType;
  /** Muestra la caja de apoyo (alarma alta o pánico marcado). */
  showSupport: boolean;
}

export interface Lead {
  nombre: string;
  email: string;
}

export interface Specialist {
  slug: string;
  nombre: string;
  rol: string;
  precioUSD: number;
  enfoque: string;
  /** Iniciales para el avatar. */
  iniciales: string;
  /** Color de fondo del avatar (token tailwind hex). */
  color: string;
}
