import type { AnxietyType } from "../types";

export interface InterstitialContent {
  eyebrow: string;
  title: string;
  body: string[];
  /** Tip breve para observar en uno mismo (no es un dato clínico duro). */
  note?: string;
  cta: string;
}

/**
 * Intersticial 1 — aparece tras las 3 primeras secciones.
 * Varía según la subescala dominante hasta ese punto: explica *por qué*
 * pasa lo que la persona viene marcando.
 */
export const INTERSTITIAL_1: Record<AnxietyType, InterstitialContent> = {
  rumia: {
    eyebrow: "Patrón rumiante",
    title: "Parece que tu ansiedad está ocupando mucho espacio en tus pensamientos",
    body: [
      "Cuando aparecen con frecuencia el \"le doy vueltas\" y el \"¿y si sale mal?\", preocuparte puede sentirse como una manera de prepararte, protegerte o encontrar una solución.",
      "Pero pensar más no siempre significa resolver mejor. A veces, darle vueltas una y otra vez a una preocupación mantiene tu atención atrapada en ella sin acercarte a una respuesta.",
    ],
    note: "La próxima vez que aparezca una preocupación, prueba preguntarte: \"¿Hay algo concreto que puedo hacer con esto hoy?\"",
    cta: "Seguir con el test",
  },
  control: {
    eyebrow: "Patrón anticipatorio",
    title: "Parece que tu ansiedad está buscando certeza",
    body: [
      "Planificar, revisar y adelantarte pueden darte una sensación de tranquilidad momentánea. El problema aparece cuando sentirte tranquilo/a empieza a depender de tener cada vez más cosas bajo control.",
      "La incertidumbre forma parte de la vida. Aprender a tolerarla gradualmente puede ayudarte a relacionarte de otra manera con aquello que no puedes prever.",
    ],
    note: "Prevenir tiene un punto de cierre. Intentar tener todo bajo control puede hacer que siempre quede algo más por revisar.",
    cta: "Seguir con el test",
  },
  social: {
    eyebrow: "Patrón social",
    title: "Parece que tu ansiedad se activa especialmente frente a la mirada de los demás",
    body: [
      "Repasar lo que dijiste, evitar opinar o compararte constantemente pueden aparecer cuando existe miedo a ser evaluado/a negativamente.",
      "Evitar una situación puede aliviar la ansiedad en el momento, pero también puede impedirte descubrir qué habría pasado realmente si hubieras participado.",
    ],
    note: "¿Cuántas decisiones estás tomando por lo que realmente quieres y cuántas por miedo a lo que otros puedan pensar?",
    cta: "Seguir con el test",
  },
  rendimiento: {
    eyebrow: "Patrón de rendimiento",
    title: "A veces la ansiedad puede parecer simplemente \"exigencia\"",
    body: [
      "Cuando descansar genera culpa, equivocarte pesa demasiado o nada parece suficiente, la autoexigencia puede convertirse en una manera de intentar protegerte del error, el fracaso o el juicio de otros.",
      "Puede ayudarte a rendir durante un tiempo, pero también puede terminar generando agotamiento o hacer más difícil comenzar cuando sientes que no podrás alcanzar el estándar que te has puesto.",
    ],
    note: "Querer hacer las cosas bien no tiene que significar exigirte hacerlas perfectas.",
    cta: "Seguir con el test",
  },
  somatica: {
    eyebrow: "Patrón somático",
    title: "Parece que tu cuerpo está expresando una parte importante de tu ansiedad",
    body: [
      "Tensión, dificultades para dormir, palpitaciones, mareo o momentos de miedo intenso pueden aparecer junto con la ansiedad.",
      "Esas sensaciones son reales. Y cuando además nos asustan, puede formarse un círculo: aparece una sensación, aumenta el miedo y ese miedo activa todavía más el cuerpo.",
    ],
    note: "Algunos síntomas físicos también pueden tener otras causas. Si son nuevos, intensos, persistentes o te preocupan, es importante consultarlos con un profesional de salud.",
    cta: "Seguir con el test",
  },
};

/**
 * Intersticial 2 — aparece tras la sección "Cómo lo llevas".
 * Normaliza las conductas de afrontamiento y prepara para el resultado.
 */
export const INTERSTITIAL_2: Record<AnxietyType, InterstitialContent> = {
  rumia: {
    eyebrow: "Patrón rumiante",
    title: "Distraerte no siempre significa calmarte",
    body: [
      "El scroll, las series o mantenerte constantemente ocupado/a pueden ayudarte a bajar el volumen de tus pensamientos durante un rato. Pero si se convierten en tu única manera de manejar lo que sientes, es posible que la preocupación vuelva cuando te detengas.",
      "En tu resultado encontrarás herramientas para comenzar a relacionarte de otra manera con esos pensamientos.",
    ],
    cta: "Ver mi resultado",
  },
  control: {
    eyebrow: "Patrón anticipatorio",
    title: "Cargar con todo también puede ser una forma de buscar control",
    body: [
      "Adelantarte constantemente a lo que podría salir mal —incluso en la vida de otras personas— puede darte una sensación temporal de seguridad. Pero también puede dejarte agotado/a.",
      "En tu resultado encontrarás herramientas para practicar algo diferente: hacer lo que sí está en tus manos y comenzar a dejar espacio para aquello que no puedes controlar.",
    ],
    cta: "Ver mi resultado",
  },
  social: {
    eyebrow: "Patrón social",
    title: "Evitar puede aliviarte ahora y mantener el miedo después",
    body: [
      "Cancelar un plan o evitar una situación que te genera ansiedad puede producir alivio inmediato. Precisamente por ese alivio, tu mente puede aprender que evitar era la manera de protegerte.",
      "En tu resultado encontrarás formas de comenzar a acercarte, poco a poco y respetando tu ritmo, a algunas de las situaciones que hoy te generan ansiedad.",
    ],
    cta: "Ver mi resultado",
  },
  rendimiento: {
    eyebrow: "Patrón de rendimiento",
    title: "Si descansas con culpa, probablemente no estás descansando del todo",
    body: [
      "Cuando sientes que primero tienes que \"merecerte\" una pausa, incluso descansar puede convertirse en otra tarea pendiente. Tu cuerpo y tu mente necesitan recuperación; el descanso también forma parte de cuidarte.",
      "En tu resultado encontrarás herramientas para comenzar a poner límites más saludables a la autoexigencia.",
    ],
    cta: "Ver mi resultado",
  },
  somatica: {
    eyebrow: "Patrón somático",
    title: "Tenerle miedo a la sensación puede aumentar el miedo",
    body: [
      "Cuando comienzas a evitar lugares o actividades por temor a experimentar determinadas sensaciones físicas, esas sensaciones pueden empezar a condicionar cada vez más lo que haces.",
      "Trabajar gradualmente la relación con ellas, especialmente con orientación profesional cuando son intensas, puede ayudarte a recuperar seguridad. En tu resultado encontrarás algunas herramientas para comenzar a comprender mejor lo que ocurre en tu cuerpo.",
    ],
    cta: "Ver mi resultado",
  },
};
