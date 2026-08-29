import type { LikertOption, Question, Section } from "../types";

/**
 * Escala tipo GAD-7 (0-3). Misma redacción que la versión validada en español,
 * para que el test se sienta clínicamente serio (ref. Grow Therapy).
 */
export const LIKERT: LikertOption[] = [
  { value: 0, label: "Ningún día" },
  { value: 1, label: "Varios días" },
  { value: 2, label: "Más de la mitad de los días" },
  { value: 3, label: "Casi todos los días" },
];

export const SECTIONS: Section[] = [
  {
    index: 1,
    key: "mente",
    title: "Tu mente en bucle",
    tagline: "Lo que pasa dentro de tu cabeza cuando nadie mira.",
    prompt:
      "En las últimas dos semanas, ¿con qué frecuencia te has sentido así?",
  },
  {
    index: 2,
    key: "cuerpo",
    title: "Tu cuerpo habla",
    tagline:
      "La ansiedad no vive solo en la mente. También en los hombros, el pecho, el estómago.",
    prompt:
      "En las últimas dos semanas, ¿con qué frecuencia lo notaste en el cuerpo?",
  },
  {
    index: 3,
    key: "los-demas",
    title: "La mirada de los demás",
    tagline: "Cómo te sientes cuando hay otras personas en la ecuación.",
    prompt:
      "En las últimas dos semanas, ¿con qué frecuencia te pasó esto con otras personas?",
  },
  {
    index: 4,
    key: "liston",
    title: "El listón siempre más alto",
    tagline: "Tu relación con el logro, el error y el 'nunca es suficiente'.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia te reconociste en esto?",
  },
  {
    index: 5,
    key: "como-lo-llevas",
    title: "Cómo lo llevas",
    tagline: "Lo que haces para sobrellevarlo y cuánto te está costando.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia ocurrió?",
  },
];

/**
 * 20 ítems. `type` define a qué subescala suma; `type: null` suma solo a la
 * severidad global (impacto funcional / conductas de afrontamiento).
 */
export const QUESTIONS: Question[] = [
  // ── Sección 1 · Tu mente en bucle ─────────────────────────────
  {
    id: "m1",
    section: 0,
    type: "rumia",
    text: "Le diste vueltas a la misma preocupación una y otra vez sin llegar a ninguna conclusión.",
  },
  {
    id: "m2",
    section: 0,
    type: "control",
    text: "Sentiste tensión difícil de soltar cuando algo quedaba en la incertidumbre o sin plan.",
  },
  {
    id: "m3",
    section: 0,
    type: "rumia",
    text: "Tu mente saltó sola a escenarios de 'y si sale mal', incluso cuando todo iba bien.",
  },
  {
    id: "m4",
    section: 0,
    type: "control",
    text: "Revisaste, confirmaste o repasaste cosas más veces de las necesarias para quedarte tranquilo/a.",
  },

  // ── Sección 2 · Tu cuerpo habla ──────────────────────────────
  {
    id: "c1",
    section: 1,
    type: "somatica",
    text: "Notaste tensión física: mandíbula apretada, hombros duros, estómago cerrado.",
  },
  {
    id: "c2",
    section: 1,
    type: "somatica",
    text: "Te costó dormirte o te despertaste de madrugada con la cabeza ya acelerada.",
  },
  {
    id: "c3",
    section: 1,
    type: "somatica",
    panicFlag: true,
    text: "Tuviste oleadas de miedo intenso con corazón disparado, falta de aire o mareo, casi de la nada.",
  },

  // ── Sección 3 · La mirada de los demás ──────────────────────
  {
    id: "s1",
    section: 2,
    type: "social",
    text: "Después de una conversación o reunión, repasaste lo que dijiste buscando en qué quedaste mal.",
  },
  {
    id: "s2",
    section: 2,
    type: "social",
    text: "Evitaste hablar, opinar o pedir algo por miedo a que te juzgaran o a incomodar.",
  },
  {
    id: "s3",
    section: 2,
    type: "social",
    text: "Comparaste tu vida con la de otros (redes incluidas) y saliste sintiéndote atrás.",
  },

  // ── Sección 4 · El listón siempre más alto ─────────────────
  {
    id: "r1",
    section: 3,
    type: "rendimiento",
    text: "Sentiste que algo 'no valía' o que fallaste porque no te salió casi perfecto.",
  },
  {
    id: "r2",
    section: 3,
    type: "rendimiento",
    text: "Te costó descansar sin culpa: si no estabas siendo productivo/a, algo te incomodaba.",
  },
  {
    id: "r3",
    section: 3,
    type: "rendimiento",
    text: "Sentiste que estás 'fingiendo' y que en cualquier momento se darán cuenta de que no eres tan capaz.",
  },
  {
    id: "r4",
    section: 3,
    type: "rendimiento",
    text: "Postergaste algo importante porque el miedo a no hacerlo bien te paralizaba.",
  },

  // ── Sección 5 · Cómo lo llevas ─────────────────────────────
  {
    id: "x1",
    section: 4,
    type: "rumia",
    text: "Usaste el celular, series o scroll para 'apagar' la mente, aunque después te sintieras peor.",
  },
  {
    id: "x2",
    section: 4,
    type: "control",
    text: "Te adelantaste a los problemas de los demás y cargaste con más de lo que te tocaba.",
  },
  {
    id: "x3",
    section: 4,
    type: "social",
    text: "Cancelaste planes o dijiste que no a oportunidades por la ansiedad que te generaban.",
  },
  {
    id: "x4",
    section: 4,
    type: "somatica",
    panicFlag: true,
    text: "Evitaste lugares o situaciones por miedo a sentirte mal físicamente o a que 'te diera algo' ahí.",
  },
  {
    id: "x5",
    section: 4,
    type: null,
    weight: 1.4,
    text: "La ansiedad afectó tu trabajo, tus estudios o tus relaciones cercanas.",
  },
  {
    id: "x6",
    section: 4,
    type: null,
    weight: 1.2,
    text: "Recurriste a comida, alcohol, cafeína o compras para calmarte más de lo que te habría gustado.",
  },
];

/** Índice de sección tras la cual va cada intersticial (0-indexed). */
export const INTERSTITIAL_AFTER_SECTION: Record<number, "dinamico1" | "dinamico2"> = {
  2: "dinamico1", // después de "La mirada de los demás" (fin de las 3 primeras secciones)
  4: "dinamico2", // después de "Cómo lo llevas"
};
