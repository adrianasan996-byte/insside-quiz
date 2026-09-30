import type { AnxietyType, SeverityLevelKey } from "../types";

export interface Tool {
  nombre: string;
  /** Cómo se hace, en 1-3 frases accionables. */
  como: string;
  /** Marco de referencia (para dar credibilidad, no jerga vacía). */
  base: string;
}

export interface TypeResult {
  key: AnxietyType;
  titulo: string;
  /** Token de color tailwind, p.ej. "type-rumia". */
  colorKey: string;
  tagline: string;
  /** Un párrafo de reconocimiento: "esto eres tú". */
  reconocimiento: string;
  /** Mini-diagnóstico: 2-3 párrafos, psicología accesible. */
  miniDiagnostico: string[];
  /** "Puede sonarte si…" — señales concretas. */
  teSuenaSi: string[];
  /** Qué alimenta este patrón. */
  queLoAgrava: string[];
  /** 3 herramientas no básicas. */
  herramientas: Tool[];
}

export const RESULTS: Record<AnxietyType, TypeResult> = {
  rumia: {
    key: "rumia",
    titulo: "Patrón rumiante",
    colorKey: "type-rumia",
    tagline: "La mente que no se apaga",
    reconocimiento:
      "Según tus respuestas, la preocupación y el pensamiento repetitivo parecen ocupar bastante espacio en cómo experimentas la ansiedad. Piensas intentando encontrar tranquilidad, una respuesta o una solución. Pero algunas veces una pregunta lleva a otra y terminas dedicando mucha energía a resolver mentalmente cosas que todavía no han ocurrido.",
    miniDiagnostico: [
      "Tus respuestas reflejan un patrón de preocupación repetitiva. Cuando aparece una duda, tu mente puede responder intentando analizarla hasta sentirse segura. El alivio que consigues puede durar poco y, ante una nueva duda, el proceso comienza otra vez.",
      "Con el tiempo, esto puede influir en el descanso, la concentración y la capacidad de estar presente.",
      "El objetivo no es dejar tu mente en blanco ni impedir que aparezcan pensamientos. Es aprender a relacionarte de otra manera con ellos: reconocer que un pensamiento puede aparecer sin convertirse automáticamente en una certeza, una orden o algo que tienes que resolver inmediatamente.",
    ],
    teSuenaSi: [
      "Tienes la misma conversación imaginaria varias veces",
      "Sientes que necesitas \"resolver\" algo antes de relajarte, pero siempre aparece algo nuevo",
      "Al acostarte es cuando tu mente parece activarse más",
      "Buscar tranquilidad o confirmación en otras personas te calma durante un rato, pero después vuelve la duda",
    ],
    queLoAgrava: [
      "Buscar constantemente certeza en internet o en otras personas",
      "Dormir poco o consumir mucha cafeína",
      "Tratar escenarios hipotéticos como si fueran problemas que necesitas resolver ahora mismo",
    ],
    herramientas: [
      {
        nombre: "Ventana de preocupación",
        como: "Elige 15 minutos del día para escribir aquello que te preocupa. Si una preocupación aparece fuera de ese momento, anótala brevemente y déjala para tu \"ventana\". Cuando llegue ese momento, vuelve a la lista y observa qué sigue necesitando tu atención y qué ha perdido intensidad.",
        base: "TCC",
      },
      {
        nombre: "Tomar distancia del pensamiento",
        como: "En lugar de \"voy a fracasar\", prueba decir: \"Estoy teniendo el pensamiento de que voy a fracasar\". Parece un cambio pequeño, pero puede ayudarte a recordar que pensar algo no significa que necesariamente vaya a ocurrir.",
        base: "ACT",
      },
      {
        nombre: "¿Es un problema de hoy o una posibilidad del futuro?",
        como: "Pregúntate: \"¿Existe una acción concreta que puedo hacer hoy?\". Si existe, identifica el siguiente paso. Si no existe, puede ser una señal de que estás intentando resolver hoy algo que todavía no ha sucedido.",
        base: "TCC",
      },
    ],
  },

  control: {
    key: "control",
    titulo: "Patrón anticipatorio",
    colorKey: "type-control",
    tagline: "La necesidad de tenerlo todo bajo control",
    reconocimiento:
      "Según tus respuestas, la incertidumbre parece ser uno de los lugares donde más se activa tu ansiedad. Planificas, revisas y te adelantas porque hacerlo puede ayudarte a sentir que las cosas están bajo control. El problema es que siempre puede aparecer algo nuevo que no habías previsto.",
    miniDiagnostico: [
      "Tus respuestas reflejan una posible dificultad para tolerar la incertidumbre. Cuando no sabes qué va a pasar, puedes sentir la necesidad de confirmar, planificar o revisar para recuperar tranquilidad. Esas acciones pueden aliviarte temporalmente, pero también pueden hacer que cada vez necesites más certeza para sentirte seguro/a.",
      "El objetivo no es convertirte en una persona despreocupada. Es aprender, poco a poco, que puedes tomar decisiones incluso cuando no tienes toda la información y que sentir incertidumbre no significa necesariamente que algo malo vaya a ocurrir.",
    ],
    teSuenaSi: [
      "Confirmas algo varias veces antes de quedarte tranquilo/a",
      "Delegar te cuesta porque sientes más seguridad haciéndolo tú",
      "Los cambios inesperados de planes te alteran especialmente",
      "Sientes que si dejas de anticiparte, algo podría salir mal",
    ],
    queLoAgrava: [
      "Crear listas y sistemas que nunca terminan de darte tranquilidad",
      "Hacerte responsable de resolver constantemente los problemas de otros",
      "Tratar decisiones pequeñas como si fueran definitivas",
    ],
    herramientas: [
      {
        nombre: "Pequeños experimentos con la incertidumbre",
        como: "Elige una situación cotidiana y de bajo riesgo en la que puedas practicar un poco menos de control: enviar un mensaje sin revisarlo repetidamente, dejar que otra persona elija el lugar o hacer un plan sin tener cada detalle definido. Después observa qué temías y qué ocurrió realmente.",
        base: "TCC",
      },
      {
        nombre: "Predicción vs. realidad",
        como: "Antes de una situación incierta, escribe qué temes que ocurra y qué probabilidad crees que tiene. Después vuelve a esa predicción y compárala con lo que realmente sucedió.",
        base: "TCC",
      },
      {
        nombre: "¿Es reversible?",
        como: "Antes de dedicar demasiada energía a una decisión, pregúntate: \"¿Puedo cambiar esto después?\". Si la respuesta es sí, prueba darte un tiempo razonable para decidir y continuar.",
        base: "Terapia basada en valores",
      },
    ],
  },

  social: {
    key: "social",
    titulo: "Patrón social",
    colorKey: "type-social",
    tagline: "El miedo a la mirada ajena",
    reconocimiento:
      "Según tus respuestas, una parte importante de tu ansiedad parece activarse cuando existe la posibilidad de sentirte observado/a, evaluado/a o juzgado/a. Puedes comenzar a preguntarte cómo te ves, qué dijiste o qué estará pensando la otra persona. Y después de la interacción, tu mente puede seguir repasándola. A veces, evitar parece mucho más fácil.",
    miniDiagnostico: [
      "Tus respuestas muestran características relacionadas con un patrón de ansiedad social o evaluativa. Cuando estás demasiado pendiente de cómo estás siendo percibido/a, tu atención puede alejarse de la conversación y centrarse en vigilarte a ti mismo/a.",
      "También pueden aparecer estrategias para sentirte más seguro/a: hablar menos, ensayar demasiado, mirar el celular o evitar determinadas situaciones.",
      "Aunque pueden ayudarte a sentir menos ansiedad en el momento, también pueden impedirte comprobar qué habría ocurrido sin ellas.",
    ],
    teSuenaSi: [
      "Ensayas mentalmente lo que vas a decir, incluso antes de conversaciones pequeñas",
      "Después de socializar repasas momentos buscando algo que hiciste mal",
      "Prefieres escribir porque así puedes revisar lo que vas a decir",
      "Alguna vez cancelaste algo, sentiste alivio inmediatamente y después te arrepentiste",
    ],
    queLoAgrava: [
      "Compararte constantemente con lo que ves en redes sociales",
      "Utilizar alcohol para sentirte más cómodo/a socialmente",
      "Repasar una interacción una y otra vez después de que terminó",
    ],
    herramientas: [
      {
        nombre: "Mover la atención hacia afuera",
        como: "En una conversación, prueba dirigir deliberadamente tu atención hacia lo que está diciendo la otra persona, sus gestos o lo que ocurre a tu alrededor, en lugar de monitorear constantemente cómo estás siendo percibido/a.",
        base: "TCC",
      },
      {
        nombre: "Soltar una pequeña conducta de seguridad",
        como: "Elige una situación de bajo riesgo y una sola conducta que normalmente utilizas para sentirte protegido/a —por ejemplo, ensayar demasiado antes de hablar— e intenta reducirla. Después observa qué temías y qué ocurrió realmente.",
        base: "TCC",
      },
      {
        nombre: "Una revisión más compasiva",
        como: "Si después de una interacción sientes la necesidad de repasarla, escribe una cosa que salió bien, una neutra y una que podrías hacer diferente la próxima vez. Después permite que esa conversación termine también dentro de tu cabeza.",
        base: "Autocompasión (Neff)",
      },
    ],
  },

  rendimiento: {
    key: "rendimiento",
    titulo: "Patrón de rendimiento",
    colorKey: "type-rendimiento",
    tagline: "El 'nunca es suficiente'",
    reconocimiento:
      "Según tus respuestas, la exigencia y el miedo a equivocarte parecen estar ocupando bastante espacio en cómo experimentas la ansiedad. Puede que desde afuera seas una persona responsable, comprometida o de alto rendimiento. Pero por dentro, alcanzar algo no siempre trae descanso: rápidamente aparece la próxima meta o algo que todavía podría estar mejor.",
    miniDiagnostico: [
      "Tus respuestas reflejan rasgos relacionados con perfeccionismo y autoexigencia. A veces, intentar hacer las cosas impecablemente puede convertirse en una manera de protegerte del error, el fracaso o el juicio.",
      "El problema es que, si tu estándar siempre se mueve, llegar nunca termina de sentirse suficiente. Y el miedo a hacerlo mal también puede hacer que postergues, revises excesivamente o evites comenzar.",
      "Parte del trabajo consiste en aprender a separar quién eres de lo que produces y construir estándares que te permitan crecer sin vivir permanentemente bajo presión.",
    ],
    teSuenaSi: [
      "Continúas trabajando en algo incluso cuando ya cumple con lo necesario",
      "Un logro te satisface durante poco tiempo antes de pensar en el siguiente",
      "Postergas empezar porque sientes que deberías hacerlo muy bien",
      "Una crítica puede quedarse contigo durante días",
    ],
    queLoAgrava: [
      "Medir el valor de tu día únicamente por cuánto hiciste",
      "Compararte con los mejores momentos que otras personas muestran",
      "No definir cuándo algo está suficientemente terminado",
    ],
    herramientas: [
      {
        nombre: "Define \"suficientemente bien\" antes de empezar",
        como: "Antes de comenzar una tarea, establece tres criterios concretos que indiquen que está terminada y un tiempo razonable para realizarla. Cuando llegues allí, practica parar.",
        base: "TCC",
      },
      {
        nombre: "Tu valor es más grande que tu rendimiento",
        como: "Haz una lista de cualidades que valoras de ti y que no dependen de tus logros: cómo escuchas, cómo quieres a otros, tu sentido del humor, tu lealtad, tu creatividad o aquello que sea importante para ti. Vuelve a ella cuando tu mente intente reducir tu valor a lo que produces.",
        base: "ACT",
      },
      {
        nombre: "Exigencia con compasión",
        como: "Cuando cometas un error, prueba preguntarte: \"¿Qué le diría a alguien que quiero y respeto si estuviera exactamente en mi situación?\". Reconoce lo ocurrido, identifica qué puedes aprender y decide el siguiente paso sin convertir el error en una definición de quién eres.",
        base: "Autocompasión (Neff)",
      },
    ],
  },

  somatica: {
    key: "somatica",
    titulo: "Patrón somático",
    colorKey: "type-somatica",
    tagline: "Cuando la ansiedad se siente en el cuerpo",
    reconocimiento:
      "Según tus respuestas, tu cuerpo parece tener un papel importante en cómo experimentas la ansiedad. Puede aparecer como tensión, dificultades para dormir, palpitaciones, opresión, mareo o momentos de miedo intenso. Y cuando esas sensaciones te asustan, es posible que comiences a prestarles todavía más atención.",
    miniDiagnostico: [
      "Tus respuestas reflejan una presencia importante de síntomas físicos que pueden aparecer asociados con ansiedad y posiblemente una mayor preocupación frente a determinadas sensaciones corporales.",
      "Puede formarse un círculo: aparece una sensación, la interpretas como señal de que algo podría estar mal, aumenta el miedo y el cuerpo se activa todavía más.",
      "Las sensaciones físicas que acompañan a la ansiedad son reales. Aprender a comprenderlas y a responder de otra manera frente a ellas puede ayudar. Un test de ansiedad no puede determinar la causa de un síntoma físico: si estos síntomas son nuevos, intensos, persistentes o diferentes a lo habitual, consulta con un profesional de salud para evaluarlos.",
    ],
    teSuenaSi: [
      "Estás muy pendiente de tu cuerpo buscando señales de que algo anda mal",
      "Algunas sensaciones físicas te generan miedo o preocupación",
      "Has dejado de ir a determinados lugares por temor a sentirte mal estando allí",
      "Algunas noches te despiertas con el cuerpo activado y no sabes exactamente por qué",
    ],
    queLoAgrava: [
      "Revisar constantemente las sensaciones de tu cuerpo",
      "Evitar actividades únicamente por miedo a determinadas sensaciones físicas",
      "Respirar de manera rápida o superficial durante momentos de mucha activación",
    ],
    herramientas: [
      {
        nombre: "Respiración lenta y cómoda",
        como: "Durante unos minutos, prueba respirar de manera lenta y cómoda, sin forzar la respiración. Puedes permitir que la exhalación sea ligeramente más larga que la inhalación si se siente natural para ti. El objetivo no es obligar a la ansiedad a desaparecer, sino crear un momento de regulación.",
        base: "Regulación fisiológica",
      },
      {
        nombre: "5-4-3-2-1",
        como: "Observa: 5 cosas que ves, 4 que puedes tocar, 3 que escuchas, 2 que hueles, 1 que saboreas. Este ejercicio busca llevar parte de tu atención desde lo que ocurre dentro de tu cuerpo hacia el momento presente y el entorno que te rodea.",
        base: "Grounding",
      },
      {
        nombre: "Exposición interoceptiva",
        como: "Con orientación profesional, se puede trabajar gradualmente con determinadas sensaciones corporales temidas para ayudar a cambiar la respuesta de miedo frente a ellas. No se recomienda hacer este tipo de exposición por cuenta propia: debe valorarse de manera individual por un profesional capacitado.",
        base: "TCC para pánico",
      },
    ],
  },
};

// ── Copy por nivel de severidad ──────────────────────────────────
export interface LevelCopy {
  headline: string;
  parrafo: string;
  tono: "ok" | "atencion" | "urgente";
}

export const LEVEL_COPY: Record<SeverityLevelKey, LevelCopy> = {
  calma: {
    headline: "Las señales aparecen de forma ocasional",
    parrafo:
      "Tus respuestas muestran algunas señales relacionadas con ansiedad, pero parecen aparecer con menor frecuencia o impacto. Este puede ser un buen momento para conocer mejor tu patrón, observar qué suele activarlo y comenzar a desarrollar herramientas para cuidar tu salud mental. No necesitas esperar a sentirte mal para comenzar a cuidarte.",
    tono: "ok",
  },
  alerta: {
    headline: "La ansiedad ya está pidiendo un poco más de atención",
    parrafo:
      "Tus respuestas muestran señales relacionadas con ansiedad que aparecen con cierta frecuencia y podrían estar requiriendo energía para gestionarlas. Vale la pena prestarles atención. Puedes comenzar explorando algunas de las herramientas de tu resultado y, si notas que la ansiedad continúa, aumenta o comienza a interferir con áreas importantes de tu vida, conversar con un profesional puede ayudarte a comprender mejor qué está ocurriendo.",
    tono: "atencion",
  },
  sobrecarga: {
    headline: "La ansiedad está interfiriendo en algunas áreas de tu vida",
    parrafo:
      "Tus respuestas reflejan señales frecuentes de ansiedad y posible interferencia en áreas como el descanso, la concentración, tus decisiones, tus relaciones o las cosas que haces y dejas de hacer. En este punto, buscar apoyo profesional puede ser especialmente útil para comprender lo que estás viviendo y trabajar con herramientas adaptadas a ti. No tienes que esperar a estar peor para pedir ayuda.",
    tono: "urgente",
  },
  alarma: {
    headline: "Tus respuestas indican que sería importante buscar apoyo profesional",
    parrafo:
      "Tus respuestas reflejan un nivel alto y frecuente de malestar o señales de una interferencia importante en tu día a día. Este test no puede determinar qué está ocurriendo clínicamente, pero sí puede ayudarte a reconocer que sería recomendable conversar con un profesional de salud mental. Existen tratamientos eficaces para distintos problemas relacionados con la ansiedad. Un profesional puede evaluar tu situación de manera individual y ayudarte a determinar qué tipo de apoyo tiene más sentido para ti.",
    tono: "urgente",
  },
};

/** Se muestra junto al nivel de severidad, sin importar cuál sea. */
export const LEVEL_DISCLAIMER =
  "Este nivel es orientativo. No representa un diagnóstico ni determina por sí solo si tienes un trastorno de ansiedad.";

// ── Secciones editoriales compartidas (bajo el resultado) ────────
export interface EditorialSection {
  id: string;
  title: string;
  body: string[];
  list?: string[];
}

export const EDITORIAL: EditorialSection[] = [
  {
    id: "como-ayuda-terapia",
    title: "¿Cómo puede ayudarte un proceso terapéutico?",
    body: [
      "Cuando intentamos manejar la ansiedad por nuestra cuenta, es común recurrir a estrategias que nos hacen sentir mejor inmediatamente: evitar, intentar controlarlo todo, buscar tranquilidad constantemente o mantenernos ocupados para no pensar. Algunas pueden aliviar durante un rato, pero no necesariamente resuelven aquello que está manteniendo la ansiedad.",
      "En terapia puedes comenzar a reconocer qué está alimentando tu ansiedad, entender cómo funciona tu patrón particular y desarrollar herramientas adaptadas a lo que estás viviendo.",
      "Existen intervenciones psicológicas con evidencia para distintos problemas relacionados con la ansiedad, especialmente las basadas en Terapia Cognitivo-Conductual (TCC). Dependiendo de cada caso, un profesional puede utilizar distintas estrategias y enfoques.",
      "Un proceso terapéutico no es idéntico para todas las personas. Por eso, una evaluación profesional permite comprender mejor qué estás viviendo y qué tipo de apoyo puede ayudarte.",
    ],
  },
  {
    id: "cuidar-el-cuerpo",
    title: "Cosas que puedes comenzar a cuidar desde hoy",
    body: [
      "Estas recomendaciones no reemplazan un proceso profesional, pero pueden formar parte del cuidado de tu salud mental. No necesitas cambiarlo todo al mismo tiempo: elige una cosa pequeña que puedas comenzar a cuidar hoy.",
    ],
    list: [
      "Sueño: intenta mantener horarios relativamente regulares para dormir y despertar.",
      "Movimiento: incorporar actividad física de manera regular puede contribuir a tu bienestar general.",
      "Cafeína y alcohol: observa cómo afectan tu cuerpo y tu ansiedad y considera reducirlos si notas que intensifican tus síntomas.",
      "Scroll y noticias: prueba establecer momentos específicos para consumirlos en lugar de mantener una exposición constante.",
      "Pausas y regulación: incorpora momentos breves durante el día para bajar el ritmo, observar cómo te sientes y volver al presente.",
    ],
  },
  {
    id: "mindfulness",
    title: "Herramientas para volver al presente",
    body: [
      "Algunas prácticas de atención plena, respiración o relajación pueden ser útiles para determinadas personas como parte del cuidado de su bienestar. No tienes que hacer todas estas cosas ni todas funcionan igual para todas las personas; prueba, observa y quédate con aquello que realmente te ayude. Puedes explorar:",
    ],
    list: [
      "Respiración consciente: dedica unos minutos a observar tu respiración sin intentar que sea perfecta.",
      "Una pausa breve: detente durante unos minutos y lleva tu atención a lo que ves, escuchas y sientes en el momento presente.",
      "Relajación muscular: observa qué partes de tu cuerpo están tensas y prueba relajarlas progresivamente.",
      "Nombrar lo que ocurre: prueba decirte \"estoy sintiendo ansiedad en este momento\" en lugar de intentar luchar inmediatamente contra la sensación.",
    ],
  },
];

export const REFERENCES: string[] = [
  "Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006.",
  "Organización Mundial de la Salud. Trastornos de ansiedad — nota descriptiva. 2023.",
  "Borkovec TD, et al. Preliminary exploration of worry: some characteristics and processes. Behav Res Ther. 1983.",
  "Carleton RN. Into the unknown: A review and synthesis of contemporary models involving uncertainty. J Anxiety Disord. 2016.",
  "Neff KD. Self-compassion: An alternative conceptualization of a healthy attitude toward oneself. Self and Identity. 2003.",
  "Hofmann SG, et al. The efficacy of cognitive behavioral therapy: A review of meta-analyses. Cognit Ther Res. 2012.",
];

export const SUPPORT_BOX = {
  title: "Si lo estás pasando muy mal ahora",
  body: [
    "Este test es una herramienta de autoconocimiento y no está diseñado para evaluar ni atender una crisis de salud mental. Si la ansiedad está interfiriendo de manera importante con tu vida, tienes crisis frecuentes, sientes que no puedes manejar lo que estás viviendo o aparecen pensamientos de hacerte daño, busca apoyo profesional lo antes posible.",
    "Si existe un riesgo inmediato para tu seguridad o la de otra persona, contacta los servicios de emergencia de tu país o acude al servicio de urgencias más cercano. No tienes que esperar a sentirte peor para pedir ayuda.",
  ],
  cta: "Hablar con Insside",
};

export const DISCLAIMER =
  "Este test no ofrece un diagnóstico clínico ni reemplaza la evaluación de un profesional de salud mental. Es una herramienta de autoconocimiento basada en principios utilizados en psicología, como la Terapia Cognitivo-Conductual (TCC) y la Terapia de Aceptación y Compromiso (ACT), e inspirada parcialmente en escalas de evaluación de ansiedad como el GAD-7. Tu email, si lo dejas, se usa solo para enviarte tu resultado y contenido relacionado de Insside; puedes darte de baja cuando quieras.";
