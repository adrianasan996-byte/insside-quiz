import type { LikertOption, Question, Section } from "../types";

/**
 * Escala de respuesta (0-3) con rango de días explícito, para que sea
 * fácil de auto-reportar sin ambigüedad ("¿varios días" cuántos son?).
 */
export const LIKERT: LikertOption[] = [
  { value: 0, label: "Nunca", days: "No me pasó en estas dos semanas." },
  { value: 1, label: "Algunos días", days: "Me pasó entre 1 y 5 días." },
  { value: 2, label: "Muchos días", days: "Me pasó entre 6 y 10 días." },
  { value: 3, label: "Casi todos los días", days: "Me pasó entre 11 y 14 días." },
];

export const HOW_TO_ANSWER = {
  title: "¿Cómo responder?",
  intro:
    "Piensa únicamente en las últimas dos semanas, es decir, los últimos 14 días. En cada pregunta, elige la opción que más se acerque a lo que has vivido durante ese período.",
  closing:
    "No necesitas recordar cada día exactamente. Elige la opción que mejor represente cómo han sido para ti estas últimas dos semanas.",
};

export const SECTIONS: Section[] = [
  {
    index: 1,
    key: "mente",
    title: "Tu mente en bucle",
    tagline: "Lo que pasa dentro de tu cabeza cuando nadie mira.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia te pasó esto?",
  },
  {
    index: 2,
    key: "cuerpo",
    title: "Tu cuerpo habla",
    tagline: "La ansiedad no se siente solo en los pensamientos. A veces, el cuerpo habla primero.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia notaste esto?",
  },
  {
    index: 3,
    key: "los-demas",
    title: "La mirada de los demás",
    tagline: "Lo que pasa dentro de ti cuando otras personas entran en la ecuación.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia te pasó esto?",
  },
  {
    index: 4,
    key: "liston",
    title: "El listón siempre más alto",
    tagline: "Tu relación con el logro, el error y esa sensación de que nunca es suficiente.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia te reconociste en esto?",
  },
  {
    index: 5,
    key: "como-lo-llevas",
    title: "Cómo lo llevas",
    tagline:
      "Lo que haces para sobrellevar la ansiedad y cuánto espacio puede estar ocupando en tu vida.",
    prompt: "En las últimas dos semanas, ¿con qué frecuencia te pasó esto?",
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
    text: "Le diste vueltas a la misma preocupación una y otra vez sin llegar a una conclusión.",
  },
  {
    id: "m2",
    section: 0,
    type: "control",
    text: "Sentiste tensión difícil de soltar cuando algo quedaba en la incertidumbre o sin un plan.",
  },
  {
    id: "m3",
    section: 0,
    type: "rumia",
    text: "Tu mente se fue automáticamente a escenarios de \"¿y si sale mal?\", incluso cuando todo iba bien.",
  },
  {
    id: "m4",
    section: 0,
    type: "control",
    text: "Revisaste, confirmaste o repasaste algo varias veces para poder sentirte tranquilo/a.",
  },

  // ── Sección 2 · Tu cuerpo habla ──────────────────────────────
  {
    id: "c1",
    section: 1,
    type: "somatica",
    text: "Sentiste tensión física, como la mandíbula apretada, los hombros tensos o malestar en el estómago.",
  },
  {
    id: "c2",
    section: 1,
    type: "somatica",
    text: "Te costó dormirte o te despertaste durante la noche con la mente acelerada.",
  },
  {
    id: "c3",
    section: 1,
    type: "somatica",
    panicFlag: true,
    text: "Experimentaste momentos de miedo intenso acompañados de sensaciones como el corazón acelerado, falta de aire o mareo.",
  },

  // ── Sección 3 · La mirada de los demás ──────────────────────
  {
    id: "s1",
    section: 2,
    type: "social",
    text: "Después de una conversación o reunión, repasaste lo que dijiste buscando algo que pudiste haber hecho o dicho mal.",
  },
  {
    id: "s2",
    section: 2,
    type: "social",
    text: "Evitaste hablar, opinar o pedir algo por miedo a ser juzgado/a, equivocarte o incomodar.",
  },
  {
    id: "s3",
    section: 2,
    type: "social",
    text: "Comparaste tu vida con la de otras personas —incluyendo lo que ves en redes sociales— y terminaste sintiendo que estabas atrás.",
  },

  // ── Sección 4 · El listón siempre más alto ─────────────────
  {
    id: "r1",
    section: 3,
    type: "rendimiento",
    text: "Sentiste que algo perdía valor o que habías fallado porque no salió tan bien como esperabas.",
  },
  {
    id: "r2",
    section: 3,
    type: "rendimiento",
    text: "Te costó descansar sin sentir culpa o sentiste que deberías estar haciendo algo productivo.",
  },
  {
    id: "r3",
    section: 3,
    type: "rendimiento",
    text: "Dudaste de tus capacidades o sentiste que, en cualquier momento, los demás podrían descubrir que no eres tan capaz como creen.",
  },
  {
    id: "r4",
    section: 3,
    type: "rendimiento",
    text: "Postergaste algo importante porque el miedo a no hacerlo suficientemente bien te paralizaba.",
  },

  // ── Sección 5 · Cómo lo llevas ─────────────────────────────
  {
    id: "x1",
    section: 4,
    type: "rumia",
    text: "Usaste el celular, las series o el scroll para desconectarte de lo que estabas sintiendo, aunque después no necesariamente te sintieras mejor.",
  },
  {
    id: "x2",
    section: 4,
    type: "control",
    text: "Te adelantaste a resolver los problemas de otras personas o cargaste con responsabilidades que no necesariamente te correspondían.",
  },
  {
    id: "x3",
    section: 4,
    type: "social",
    text: "Cancelaste planes o rechazaste oportunidades por la ansiedad que te generaban.",
  },
  {
    id: "x4",
    section: 4,
    type: "somatica",
    panicFlag: true,
    text: "Evitaste lugares o situaciones por miedo a sentirte mal físicamente o a que algo te pasara estando allí.",
  },
  {
    id: "x5",
    section: 4,
    type: null,
    weight: 1.4,
    text: "Sentiste que la ansiedad estaba afectando tu trabajo, tus estudios o tus relaciones cercanas.",
  },
  {
    id: "x6",
    section: 4,
    type: null,
    weight: 1.2,
    text: "Recurriste a la comida, el alcohol, la cafeína o las compras para intentar calmarte más de lo que te habría gustado.",
  },
];

/** Índice de sección tras la cual va cada intersticial (0-indexed). */
export const INTERSTITIAL_AFTER_SECTION: Record<number, "dinamico1" | "dinamico2"> = {
  2: "dinamico1", // después de "La mirada de los demás" (fin de las 3 primeras secciones)
  4: "dinamico2", // después de "Cómo lo llevas"
};
