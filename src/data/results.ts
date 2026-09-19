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
  /** "Te suena si…" — señales concretas. */
  teSuenaSi: string[];
  /** Qué alimenta este patrón. */
  queLoAgrava: string[];
  /** 3 herramientas no básicas. */
  herramientas: Tool[];
}

export const RESULTS: Record<AnxietyType, TypeResult> = {
  rumia: {
    key: "rumia",
    titulo: "Ansiedad rumiante",
    colorKey: "type-rumia",
    tagline: "La mente que no se apaga",
    reconocimiento:
      "Tu ansiedad se juega en la cabeza. Piensas para sentirte a salvo, pero el pensamiento no cierra: se abre en más pensamiento. Puedes pasar horas resolviendo por dentro algo que por fuera ni siquiera ha pasado.",
    miniDiagnostico: [
      "Lo que describes encaja con un patrón de rumiación y preocupación anticipatoria, el núcleo de la ansiedad generalizada. El mecanismo es este: ante la duda, tu mente propone 'pensémoslo bien'. Piensas, sientes un alivio mínimo, y el cerebro registra que preocuparse 'funcionó'. La próxima duda dispara el mismo bucle, un poco más rápido.",
      "El costo no es solo el tiempo. La preocupación crónica mantiene el cuerpo en activación baja pero constante: peor sueño, más irritabilidad, menos foco. Y como casi nada de lo que temías ocurre, nunca llega la prueba de que podías soltar antes.",
      "La salida no es 'dejar de pensar' —eso no existe— sino cambiar tu relación con los pensamientos: dejar de tratarlos como órdenes o profecías y empezar a verlos como eventos mentales que puedes observar sin obedecer.",
    ],
    teSuenaSi: [
      "Te descubres teniendo la misma conversación imaginaria varias veces",
      "Necesitas 'resolver' algo antes de poder relajarte, y siempre hay algo",
      "Te cuesta empezar a dormir porque ahí es cuando la mente arranca",
      "Pedir tranquilidad a otros te calma un rato y después vuelve la duda",
    ],
    queLoAgrava: [
      "Buscar certeza en Google o en gente cercana (reassurance)",
      "Cafeína alta y sueño corto",
      "Resolver problemas hipotéticos como si fueran reales y urgentes",
    ],
    herramientas: [
      {
        nombre: "Ventana de preocupación",
        como: "Agenda 15 minutos fijos al día para preocuparte a propósito, por escrito. Cuando una preocupación aparezca fuera de ese horario, anótala en una línea y posponla a la ventana. Al llegar la ventana, la mayoría ya no te interesa.",
        base: "TCC",
      },
      {
        nombre: "Distanciamiento del pensamiento",
        como: "Cambia 'voy a fracasar' por 'estoy teniendo el pensamiento de que voy a fracasar'. Nómbralo como lo que es —una frase que tu mente produjo— y decide si le haces caso o no, igual que con un email spam.",
        base: "ACT",
      },
      {
        nombre: "¿Problema real o hipotético?",
        como: "Ante cada vuelta, pregúntate: ¿hay una acción que puedo hacer hoy? Si sí, defínela y hazla. Si no —es hipotético o futuro— es señal de soltar, no de seguir pensando.",
        base: "TCC",
      },
    ],
  },

  control: {
    key: "control",
    titulo: "Ansiedad anticipatoria",
    colorKey: "type-control",
    tagline: "La necesidad de tenerlo todo bajo control",
    reconocimiento:
      "Para ti, no saber es lo más incómodo que hay. Planeas, revisas, te adelantas. Funciona: casi todo sale bien. Pero el precio es que nunca terminas de bajar la guardia, porque siempre hay un cabo suelto que podría fallar.",
    miniDiagnostico: [
      "Tu perfil apunta a una intolerancia a la incertidumbre alta: el motor psicológico donde la duda se vive como amenaza y el control como la única respuesta posible. Cada acto de control —confirmar, planificar, chequear— alivia por minutos y refuerza la idea de que sin ese control algo malo pasaría.",
      "El problema es que el control tiene un techo. Puedes prever mucho, no todo. Y cuanto más control necesitas para sentirte tranquilo/a, menos tranquilidad te da la vida normal, que es incierta por definición.",
      "El trabajo no es volverte descuidado/a. Es entrenar la tolerancia a 'no saber' en dosis pequeñas y voluntarias, hasta que tu sistema nervioso aprenda que la incertidumbre es incómoda pero no peligrosa.",
    ],
    teSuenaSi: [
      "Reservas, confirmas y vuelves a confirmar hasta 'quedar tranquilo/a'",
      "Delegar te cuesta porque 'si lo hago yo, sé que está bien'",
      "Los planes de otros que cambian a última hora te descolocan mucho",
      "Sientes que si dejas de anticipar, todo se va a caer",
    ],
    queLoAgrava: [
      "Listas y checklists infinitas que nunca reducen la ansiedad, solo la mueven",
      "Rodearte de personas a las que también 'les resuelves' la vida",
      "Tratar cada decisión pequeña como si fuera irreversible",
    ],
    herramientas: [
      {
        nombre: "Micro-exposición a la incertidumbre",
        como: "Elige a diario un acto pequeño de no-control: enviar el mensaje sin releerlo tres veces, dejar que otra persona elija el lugar, salir sin plan B. Registra qué temías y qué pasó de verdad.",
        base: "TCC",
      },
      {
        nombre: "Registro predicción vs. realidad",
        como: "Antes de un evento incierto, escribe tu predicción catastrófica y qué tan seguro/a estás (0-100%). Después anota el resultado real. Con dos semanas de registros verás el sesgo con datos propios.",
        base: "TCC",
      },
      {
        nombre: "La regla de la reversibilidad",
        como: "Antes de gastar energía en controlar una decisión, pregúntate: ¿es reversible? Si lo es —y casi todo lo cotidiano lo es— date permiso para decidir en 2 minutos y seguir.",
        base: "Terapia basada en valores",
      },
    ],
  },

  social: {
    key: "social",
    titulo: "Ansiedad social",
    colorKey: "type-social",
    tagline: "El miedo a la mirada ajena",
    reconocimiento:
      "Cuando hay otras personas, una parte de ti se pone en modo vigilancia: ¿cómo me estoy viendo?, ¿dije algo raro?, ¿estoy incomodando? Después repasas la escena buscando el error. A veces es más fácil no ir.",
    miniDiagnostico: [
      "Lo que marcas es coherente con ansiedad social o evaluativa: la anticipación de ser juzgado/a negativamente y la atención puesta en ti mismo/a durante la interacción, en lugar de en la conversación. Esa auto-observación te hace sentir más expuesto/a y te confirma el miedo.",
      "Aparecen casi siempre dos piezas. Una: conductas de seguridad —hablar poco, ensayar frases, mirar el celular— que te dan sensación de protección pero te desconectan del momento. Dos: el post-mortem, ese repaso crítico después, que graba en la memoria solo lo que salió mal.",
      "El cambio viene de dos lados: reducir la evitación en pasos tolerables y soltar las conductas de seguridad, para que tu cerebro pueda registrar por fin que la situación temida no termina en catástrofe.",
    ],
    teSuenaSi: [
      "Ensayas mentalmente lo que vas a decir, incluso llamadas cortas",
      "Después de socializar te queda una 'resaca' de vergüenza sin motivo claro",
      "Prefieres escribir antes que hablar para poder editar",
      "Cancelaste algo y sentiste alivio inmediato… y culpa después",
    ],
    queLoAgrava: [
      "Comparación con vidas editadas en redes",
      "Alcohol como 'lubricante social' (baja la ansiedad hoy, la sube mañana)",
      "Rumiar la interacción en vez de cerrarla",
    ],
    herramientas: [
      {
        nombre: "Reencuadre del efecto foco",
        como: "Antes de entrar a una situación social, recuérdate: la gente está mucho más pendiente de cómo se ve ella que de cómo te ves tú. Pon tu atención afuera —en lo que dice el otro, en el entorno— en vez de en tu monitoreo interno.",
        base: "TCC",
      },
      {
        nombre: "Experimento: soltar una conducta de seguridad",
        como: "Elige una sola muleta (ensayar, no opinar, revisar el celular) y suéltala a propósito en una interacción. Observa: ¿pasó lo que temías? Casi nunca. Repite subiendo la dificultad.",
        base: "TCC",
      },
      {
        nombre: "Post-mortem compasivo",
        como: "Si vas a repasar una interacción, hazlo con reglas: anota una cosa que salió bien, una neutra y máximo una a mejorar, en tono de entrenador, no de fiscal. Luego cierra el cuaderno.",
        base: "Autocompasión (Neff)",
      },
    ],
  },

  rendimiento: {
    key: "rendimiento",
    titulo: "Ansiedad de rendimiento",
    colorKey: "type-rendimiento",
    tagline: "El 'nunca es suficiente'",
    reconocimiento:
      "Te exiges como si tu valor dependiera de cada resultado. Descansar da culpa, el error escuece más de lo razonable, y aunque por fuera 'funciona', por dentro hay una voz que dice que no estás haciendo lo suficiente.",
    miniDiagnostico: [
      "Tu patrón encaja con perfeccionismo ansioso y, muy probablemente, con el fenómeno del impostor. La lógica de fondo: 'si soy impecable, estoy a salvo del juicio y del fracaso'. Rinde a corto plazo, por eso es tan difícil de soltar, pero deja agotamiento, procrastinación por miedo y una autoestima que sube y baja con cada tarea.",
      "El perfeccionismo no es amor por la excelencia. Es una estrategia de evitación: evitas la sensación que crees que llegaría si no fueras suficiente. Por eso subir el estándar nunca calma; solo mueve la meta.",
      "El trabajo es separar identidad de desempeño, definir 'suficientemente bueno' antes de empezar (no después, cuando ya no hay freno), y aprender a tratarte con la misma exigencia amable con la que tratarías a alguien que respetas.",
    ],
    teSuenaSi: [
      "Terminas tareas mucho después del punto en que ya estaban bien",
      "Un logro te dura poco: enseguida piensas en el siguiente",
      "Postergas empezar porque 'si no lo hago perfecto, mejor no lo hago'",
      "Un comentario crítico te ocupa la cabeza durante días",
    ],
    queLoAgrava: [
      "Medir tu día solo por lo producido",
      "Compararte con el highlight reel de otros en tu campo",
      "No tener criterios de 'terminado', así el trabajo se estira sin fin",
    ],
    herramientas: [
      {
        nombre: "Definir el 'suficientemente bueno' antes de empezar",
        como: "Antes de una tarea, escribe 3 criterios concretos de 'terminado' y un límite de tiempo. Cuando los cumplas, entregas. El objetivo es practicar parar en 'bien', no llegar a 'perfecto'.",
        base: "TCC",
      },
      {
        nombre: "Hoja de valores: valía ≠ rendimiento",
        como: "Haz una lista de lo que te hace valioso/a para las personas que quieres (cómo escuchas, tu humor, tu lealtad). Ninguna es un KPI. Vuelve a ella cuando la mente diga que solo vales por lo que produces.",
        base: "ACT",
      },
      {
        nombre: "Autocompasión con estándares",
        como: "Ante un error, di lo que le dirías a un amigo/a capaz que la embarró: reconoce el fallo, ubícalo en contexto, define el siguiente paso. Exigente y amable a la vez; no es lo uno o lo otro.",
        base: "Autocompasión (Neff)",
      },
    ],
  },

  somatica: {
    key: "somatica",
    titulo: "Ansiedad somática",
    colorKey: "type-somatica",
    tagline: "La ansiedad que se siente en el cuerpo",
    reconocimiento:
      "Tu ansiedad no siempre viene con un pensamiento claro: viene con opresión en el pecho, tensión, insomnio, a veces oleadas de miedo casi de la nada. El cuerpo se activa como si hubiera un peligro, y esa sensación asusta por sí sola.",
    miniDiagnostico: [
      "Lo que describes apunta a una ansiedad de expresión somática, con rasgos de sensibilidad a las sensaciones corporales (lo que en clínica se llama sensibilidad a la ansiedad). El circuito: tu sistema de alarma se dispara sin amenaza real, notas los síntomas físicos, los interpretas como señal de que algo va muy mal, y esa interpretación sube todavía más la activación. Así se forman los picos de pánico.",
      "Estos síntomas son reales y tienen base fisiológica: no estás exagerando. Y aunque son muy desagradables, no son peligrosos en sí mismos; el cuerpo no puede sostener ese estado indefinidamente y siempre baja.",
      "El trabajo tiene dos frentes: regular la activación con técnicas de respiración y anclaje, y perder el miedo a las sensaciones mediante exposición gradual, para dejar de evitar y recuperar terreno.",
    ],
    teSuenaSi: [
      "Te escaneas el cuerpo buscando si algo 'anda mal'",
      "Evitas cafeína, ejercicio intenso o calor por miedo a que disparen los síntomas",
      "Dejaste de ir a ciertos lugares por si 'te da algo' ahí",
      "Te despiertas de madrugada con el corazón acelerado sin saber por qué",
    ],
    queLoAgrava: [
      "Vigilar y medir constantemente las sensaciones físicas",
      "Evitar todo lo que sube pulsaciones, incluido el ejercicio saludable",
      "Contener la respiración o respirar rápido y superficial sin darte cuenta",
    ],
    herramientas: [
      {
        nombre: "Respiración 4-6 (exhalación larga)",
        como: "Inhala por la nariz 4 segundos, exhala lento por la boca 6. La exhalación más larga que la inhalación activa el freno del sistema nervioso. 2-3 minutos, varias veces al día, no solo en crisis.",
        base: "Regulación fisiológica",
      },
      {
        nombre: "Anclaje 5-4-3-2-1",
        como: "Nombra 5 cosas que ves, 4 que puedes tocar, 3 que oyes, 2 que hueles, 1 que saboreas. Saca la atención del monitoreo interno y la trae al presente y al entorno.",
        base: "DBT / grounding",
      },
      {
        nombre: "Exposición interoceptiva (con guía)",
        como: "Con un profesional, provocar a propósito y en dosis seguras las sensaciones temidas (subir escaleras, girar en la silla) para que el cerebro aprenda que no son peligrosas. Antes: descartar causas médicas.",
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
    headline: "Tu ansiedad está en un rango manejable",
    parrafo:
      "Hay señales de ansiedad, pero por ahora no parecen estar tomando el control de tu día a día. Es un buen momento para conocer tu patrón y sumar herramientas antes de que aprieten. La prevención en salud mental funciona igual que en salud física.",
    tono: "ok",
  },
  alerta: {
    headline: "Tu ansiedad ya te está pidiendo atención",
    parrafo:
      "Tus respuestas muestran una ansiedad presente y con cierto impacto: aparece seguido y te cuesta cierto esfuerzo gestionarla. No es una emergencia, pero sí una señal clara para empezar a trabajarla con método, no solo aguantándola.",
    tono: "atencion",
  },
  sobrecarga: {
    headline: "Tu ansiedad está condicionando cómo vives",
    parrafo:
      "El nivel que reportas suele venir con desgaste real: sueño, foco, ánimo y relaciones se resienten, y una parte de tu energía se va en contener o evitar. A este nivel, el acompañamiento profesional no es un lujo: es lo que más acelera la mejora.",
    tono: "urgente",
  },
  alarma: {
    headline: "Tu ansiedad necesita apoyo cuanto antes",
    parrafo:
      "Tus respuestas describen un malestar alto y sostenido, probablemente con síntomas físicos intensos o evitación importante. Esto tiene tratamiento y se puede reducir de forma significativa, pero no es momento de hacerlo en solitario. Buscar ayuda ahora es la decisión sensata, no la exagerada.",
    tono: "urgente",
  },
};

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
    title: "Cómo ayuda un proceso terapéutico con la ansiedad",
    body: [
      "Cuando intentamos manejar la ansiedad por nuestra cuenta, solemos recurrir a estrategias que alivian en el momento pero la mantienen a largo plazo: evitar, controlar, buscar tranquilidad en otros, distraernos sin parar. Un proceso terapéutico ayuda justamente a identificar esas estrategias y a reemplazarlas por otras que sí reducen la ansiedad de forma duradera.",
      "Los enfoques con más evidencia para la ansiedad —terapia cognitivo-conductual (TCC), terapia de aceptación y compromiso (ACT), exposición— trabajan sobre el mecanismo, no solo sobre el síntoma. Con acompañamiento, la mayoría de las personas con ansiedad logran reducirla de forma marcada, y muchas la llevan a un nivel que ya no condiciona su vida.",
    ],
  },
  {
    id: "cuidar-el-cuerpo",
    title: "Lo que puedes empezar hoy por tu cuenta",
    body: [
      "Nada de esto reemplaza un proceso profesional, pero sostiene el terreno mientras tanto y potencia cualquier tratamiento:",
    ],
    list: [
      "Sueño regular: acostarte y levantarte a horas parecidas, incluso el fin de semana.",
      "Movimiento: caminar a diario ya tiene efecto ansiolítico; no hace falta entrenar fuerte.",
      "Cafeína y alcohol: bajarlos, sobre todo por la tarde. Ambos amplifican los síntomas físicos de ansiedad.",
      "Límite al scroll y a las noticias: ventanas acotadas, no goteo continuo.",
      "Respiración con exhalación larga: 2-3 minutos, varias veces al día, como mantenimiento y no solo en crisis.",
    ],
  },
  {
    id: "mindfulness",
    title: "Técnicas de atención plena que sí tienen respaldo",
    body: [
      "La práctica regular de atención plena reduce síntomas de ansiedad y mejora la capacidad de sostener el malestar sin reaccionar en automático. Algunas formas de empezar:",
    ],
    list: [
      "Ejercicios de respiración: cuando aparezca la ansiedad, pon un temporizador de unos minutos y lleva la atención a inhalar y exhalar.",
      "Rutina breve de meditación: pocos minutos al día ya tienen beneficios sobre el bienestar.",
      "Relajación muscular progresiva: recorre el cuerpo notando zonas tensas y suéltalas de forma deliberada.",
      "Etiquetar la experiencia: nombrar 'esto es ansiedad, es una ola, va a bajar' en lugar de luchar con ella.",
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
    "Si sientes que no puedes con esto, si la ansiedad viene con crisis frecuentes, o si aparecen pensamientos de hacerte daño, no esperes al resultado de un test: habla hoy con un profesional de salud mental o con la línea de atención en crisis de tu país.",
    "Si hay riesgo inmediato para tu seguridad, contacta los servicios de emergencia locales.",
  ],
};

export const DISCLAIMER =
  "Este test es una herramienta de autoconocimiento basada en modelos de psicología (TCC y ACT) e inspirada en escalas como el GAD-7. No es un diagnóstico clínico ni sustituye la valoración de un profesional. Tu email o WhatsApp, si los dejas, se usan solo para enviarte tu resultado y contactarte de parte de Insside; puedes pedir que dejemos de escribirte cuando quieras.";
