import { QUESTIONS } from "../data/questions";
import type {
  Answers,
  AnxietyType,
  ScoreResult,
  SeverityLevel,
} from "../types";

export const ANXIETY_TYPES: AnxietyType[] = [
  "rumia",
  "control",
  "social",
  "rendimiento",
  "somatica",
];

export const SEVERITY_LEVELS: SeverityLevel[] = [
  { key: "calma", label: "Calma vigilante", range: [0, 24] },
  { key: "alerta", label: "Sobre-alerta", range: [25, 49] },
  { key: "sobrecarga", label: "Sobrecarga", range: [50, 74] },
  { key: "alarma", label: "Señal de alarma", range: [75, 100] },
];

export function levelForScore(total: number): SeverityLevel {
  return (
    SEVERITY_LEVELS.find((l) => total >= l.range[0] && total <= l.range[1]) ??
    SEVERITY_LEVELS[SEVERITY_LEVELS.length - 1]
  );
}

const MAX_LIKERT = 3;

/** Porcentaje 0-100 de una subescala dado un set de respuestas. */
function subscalePct(type: AnxietyType, answers: Answers): number {
  const items = QUESTIONS.filter((q) => q.type === type);
  if (items.length === 0) return 0;
  let sum = 0;
  let answered = 0;
  for (const q of items) {
    const v = answers[q.id];
    if (v === undefined) continue;
    sum += v;
    answered += 1;
  }
  if (answered === 0) return 0;
  // Se normaliza sobre los ítems respondidos para que un cálculo parcial
  // (intersticial) sea comparable entre subescalas.
  return Math.round((sum / (answered * MAX_LIKERT)) * 100);
}

/**
 * Subescala dominante considerando solo las secciones ya respondidas.
 * Se usa para el primer intersticial dinámico.
 */
export function partialDominant(answers: Answers): AnxietyType {
  const scored = ANXIETY_TYPES.map((t) => ({ t, pct: subscalePct(t, answers) }));
  scored.sort((a, b) => b.pct - a.pct);
  return scored[0].pct > 0 ? scored[0].t : "rumia";
}

export function computeScores(answers: Answers): ScoreResult {
  // ── Severidad global: suma ponderada sobre todos los ítems respondidos ──
  let weightedSum = 0;
  let weightedMax = 0;
  for (const q of QUESTIONS) {
    const v = answers[q.id];
    if (v === undefined) continue;
    const w = q.weight ?? 1;
    weightedSum += v * w;
    weightedMax += MAX_LIKERT * w;
  }
  const total = weightedMax === 0 ? 0 : Math.round((weightedSum / weightedMax) * 100);
  const level = levelForScore(total);

  // ── Subescalas ──
  const subscales = ANXIETY_TYPES.reduce(
    (acc, t) => {
      acc[t] = subscalePct(t, answers);
      return acc;
    },
    {} as Record<AnxietyType, number>,
  );

  const ranked = [...ANXIETY_TYPES].sort((a, b) => {
    if (subscales[b] !== subscales[a]) return subscales[b] - subscales[a];
    // Desempate estable por orden canónico.
    return ANXIETY_TYPES.indexOf(a) - ANXIETY_TYPES.indexOf(b);
  });

  // ── Flag de apoyo ──
  // "Más de la mitad de los días" o más en un ítem de pánico/evitación fóbica.
  const panicHit = QUESTIONS.some(
    (q) => q.panicFlag && (answers[q.id] ?? 0) >= 2,
  );
  const showSupport = level.key === "alarma" || panicHit;

  return {
    total,
    level,
    subscales,
    ranked,
    primary: ranked[0],
    secondary: ranked[1],
    showSupport,
  };
}
