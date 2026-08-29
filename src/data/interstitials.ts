import type { AnxietyType } from "../types";

export interface InterstitialContent {
  eyebrow: string;
  title: string;
  body: string[];
  /** Dato enmarcado (psicoeducación, sin cifras inventadas). */
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
    eyebrow: "Lo que llevas marcado",
    title: "Tu ansiedad vive, sobre todo, en el pensamiento",
    body: [
      "Cuando marcas mucho 'le doy vueltas' y 'y si sale mal', tu mente está usando la preocupación como si fuera una forma de resolver. El problema es que rumiar no resuelve: mantiene el problema encendido sin cerrarlo.",
      "El cerebro aprende que preocuparse 'sirve' porque, casi siempre, lo que temías no pasó. Pero no pasó por azar, no por haberlo pensado 200 veces. Esa confusión es la que alimenta el bucle.",
    ],
    note: "La investigación sobre la preocupación muestra que la mayoría de lo que anticipamos con angustia no llega a ocurrir, y cuando ocurre solemos afrontarlo mejor de lo previsto.",
    cta: "Seguir con el test",
  },
  control: {
    eyebrow: "Lo que llevas marcado",
    title: "Tu ansiedad busca certeza donde no la hay",
    body: [
      "Planificar, revisar y adelantarte son intentos de eliminar la incertidumbre. Alivian por unos minutos, pero le enseñan a tu sistema nervioso que no tolera 'no saber', así que la próxima vez necesitarás más control para sentir lo mismo.",
      "La intolerancia a la incertidumbre es uno de los motores mejor documentados de la ansiedad. La buena noticia: se puede entrenar, igual que un músculo.",
    ],
    note: "No es lo mismo prevenir que controlar. Prevenir es un acto puntual y termina; controlar es un estado permanente que nunca se apaga del todo.",
    cta: "Seguir con el test",
  },
  social: {
    eyebrow: "Lo que llevas marcado",
    title: "Tu ansiedad se activa con la mirada de los demás",
    body: [
      "Repasar lo que dijiste, evitar opinar, compararte: son señales de ansiedad social o evaluativa. Detrás hay una predicción automática —'me van a juzgar'— que casi nunca se comprueba, porque la evitación te impide ver que no pasa nada.",
      "El 'efecto foco' hace que sobreestimes cuánto te miran y te recuerdan los demás. En la práctica, la gente está mucho más pendiente de sí misma que de ti.",
    ],
    note: "Cada vez que evitas una situación social por miedo, el alivio inmediato refuerza el miedo para la próxima. Es un préstamo con intereses.",
    cta: "Seguir con el test",
  },
  rendimiento: {
    eyebrow: "Lo que llevas marcado",
    title: "Tu ansiedad se disfraza de exigencia",
    body: [
      "Cuando el descanso da culpa y el error se siente como fracaso, la ansiedad se esconde detrás de la palabra 'responsabilidad'. Rinde a corto plazo y por eso cuesta soltarla, pero el precio es agotamiento y la sensación de que nunca es suficiente.",
      "El perfeccionismo no es amor por la excelencia: es miedo a lo que crees que pasará si no eres impecable. Ese miedo se puede mirar de frente.",
    ],
    note: "Separar tu valor como persona de tu rendimiento no te hace rendir menos. En general, reduce el bloqueo y la procrastinación.",
    cta: "Seguir con el test",
  },
  somatica: {
    eyebrow: "Lo que llevas marcado",
    title: "Tu ansiedad habla primero por el cuerpo",
    body: [
      "Tensión, insomnio, opresión en el pecho, oleadas de miedo: tu sistema de alarma está activándose aunque no haya un peligro real delante. El cuerpo reacciona como si lo hubiera, y esas sensaciones dan miedo por sí mismas, lo que sube todavía más la activación.",
      "No estás exagerando ni 'inventando' los síntomas. Son reales y tienen una explicación fisiológica. Y se pueden regular con práctica.",
    ],
    note: "Si los síntomas físicos son intensos o nuevos, conviene descartar causas médicas con un profesional. Hecho eso, el trabajo psicológico sobre la ansiedad es muy efectivo.",
    cta: "Seguir con el test",
  },
};

/**
 * Intersticial 2 — aparece tras la sección "Cómo lo llevas".
 * Normaliza las conductas de afrontamiento y prepara para el resultado.
 */
export const INTERSTITIAL_2: Record<AnxietyType, InterstitialContent> = {
  rumia: {
    eyebrow: "Antes de tu resultado",
    title: "Distraerte no es lo mismo que calmarte",
    body: [
      "El scroll, las series y estar siempre 'haciendo algo' bajan el volumen del pensamiento por un rato, pero no procesan nada. Por eso vuelve, muchas veces más fuerte, cuando por fin te detienes.",
      "En tu resultado vas a encontrar herramientas para trabajar el pensamiento en lugar de solo taparlo.",
    ],
    cta: "Ver mi resultado",
  },
  control: {
    eyebrow: "Antes de tu resultado",
    title: "Cargar con todo también es una conducta de seguridad",
    body: [
      "Adelantarte a los problemas de los demás calma tu ansiedad, no la de ellos. Es una forma de control que te deja exhausto/a y a los demás sin espacio para resolver lo suyo.",
      "En tu resultado vas a encontrar formas concretas de tolerar la incertidumbre sin apagarla con más esfuerzo.",
    ],
    cta: "Ver mi resultado",
  },
  social: {
    eyebrow: "Antes de tu resultado",
    title: "Cada plan que cancelas confirma el miedo",
    body: [
      "Decir que no a lo que te da ansiedad social trae un alivio inmediato y real. El problema es lo que ese alivio le enseña a tu cerebro: 'menos mal que no fui'. Así el mundo seguro se hace cada vez más pequeño.",
      "En tu resultado vas a encontrar experimentos para probar, en dosis pequeñas, que puedes estar ahí y sostenerlo.",
    ],
    cta: "Ver mi resultado",
  },
  rendimiento: {
    eyebrow: "Antes de tu resultado",
    title: "El descanso con culpa no descansa",
    body: [
      "Si para desconectar necesitas 'merecértelo', tu sistema nervioso nunca baja del todo. La recuperación real no se gana: se necesita, como el agua.",
      "En tu resultado vas a encontrar herramientas para poner un techo sano a la autoexigencia.",
    ],
    cta: "Ver mi resultado",
  },
  somatica: {
    eyebrow: "Antes de tu resultado",
    title: "Evitar el síntoma lo vuelve más grande",
    body: [
      "Cuando dejas de ir a lugares por miedo a sentirte mal, tu cuerpo nunca llega a comprobar que esas sensaciones, aunque incómodas, no son peligrosas y bajan solas.",
      "En tu resultado vas a encontrar técnicas para regular la activación y volver, poco a poco, a lo que dejaste de hacer.",
    ],
    cta: "Ver mi resultado",
  },
};
