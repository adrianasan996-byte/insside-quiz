/**
 * Endpoint serverless (Vercel) que recibe el lead del quiz, lo valida y lo
 * reenvía al webhook de GoHighLevel (trigger "Inbound Webhook" de un workflow).
 *
 * La URL del webhook vive solo en la variable de entorno GHL_WEBHOOK_URL del
 * servidor: nunca llega al navegador ni al repo.
 *
 * Este archivo es autocontenido a propósito (sin imports de ../src) para no
 * depender de cómo Vercel resuelve módulos ESM en las funciones.
 * Referencia de campos: ver README → "Integración con GoHighLevel".
 */

interface Req {
  method?: string;
  body?: unknown;
}

interface Res {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
}

// Mantener sincronizado con src/data/results.ts (api/lead.test.ts falla si se desalinean)
export const PERFILES = {
  rumia: "Patrón rumiante",
  control: "Patrón anticipatorio",
  social: "Patrón social",
  rendimiento: "Patrón de rendimiento",
  somatica: "Patrón somático",
} as const;

export const NIVELES = {
  calma: "Calma vigilante",
  alerta: "Sobre-alerta",
  sobrecarga: "Sobrecarga",
  alarma: "Señal de alarma",
} as const;

/** Textos para los correos de GHL: lo mismo que la persona vio en su resultado. */
export const TEXTO_PERFIL: Record<
  PerfilKey,
  { descripcion: string; herramienta: string; herramientaComo: string }
> = {
  rumia: {
    descripcion:
      "Según tus respuestas, la preocupación y el pensamiento repetitivo parecen ocupar bastante espacio en cómo experimentas la ansiedad. Piensas intentando encontrar tranquilidad, una respuesta o una solución. Pero algunas veces una pregunta lleva a otra y terminas dedicando mucha energía a resolver mentalmente cosas que todavía no han ocurrido.",
    herramienta: "Ventana de preocupación",
    herramientaComo:
      'Elige 15 minutos del día para escribir aquello que te preocupa. Si una preocupación aparece fuera de ese momento, anótala brevemente y déjala para tu "ventana". Cuando llegue ese momento, vuelve a la lista y observa qué sigue necesitando tu atención y qué ha perdido intensidad.',
  },
  control: {
    descripcion:
      "Según tus respuestas, la incertidumbre parece ser uno de los lugares donde más se activa tu ansiedad. Planificas, revisas y te adelantas porque hacerlo puede ayudarte a sentir que las cosas están bajo control. El problema es que siempre puede aparecer algo nuevo que no habías previsto.",
    herramienta: "Pequeños experimentos con la incertidumbre",
    herramientaComo:
      "Elige una situación cotidiana y de bajo riesgo en la que puedas practicar un poco menos de control: enviar un mensaje sin revisarlo repetidamente, dejar que otra persona elija el lugar o hacer un plan sin tener cada detalle definido. Después observa qué temías y qué ocurrió realmente.",
  },
  social: {
    descripcion:
      "Según tus respuestas, una parte importante de tu ansiedad parece activarse cuando existe la posibilidad de sentirte observado/a, evaluado/a o juzgado/a. Puedes comenzar a preguntarte cómo te ves, qué dijiste o qué estará pensando la otra persona. Y después de la interacción, tu mente puede seguir repasándola. A veces, evitar parece mucho más fácil.",
    herramienta: "Mover la atención hacia afuera",
    herramientaComo:
      "En una conversación, prueba dirigir deliberadamente tu atención hacia lo que está diciendo la otra persona, sus gestos o lo que ocurre a tu alrededor, en lugar de monitorear constantemente cómo estás siendo percibido/a.",
  },
  rendimiento: {
    descripcion:
      "Según tus respuestas, la exigencia y el miedo a equivocarte parecen estar ocupando bastante espacio en cómo experimentas la ansiedad. Puede que desde afuera seas una persona responsable, comprometida o de alto rendimiento. Pero por dentro, alcanzar algo no siempre trae descanso: rápidamente aparece la próxima meta o algo que todavía podría estar mejor.",
    herramienta: 'Define "suficientemente bien" antes de empezar',
    herramientaComo:
      "Antes de comenzar una tarea, establece tres criterios concretos que indiquen que está terminada y un tiempo razonable para realizarla. Cuando llegues allí, practica parar.",
  },
  somatica: {
    descripcion:
      "Según tus respuestas, tu cuerpo parece tener un papel importante en cómo experimentas la ansiedad. Puede aparecer como tensión, dificultades para dormir, palpitaciones, opresión, mareo o momentos de miedo intenso. Y cuando esas sensaciones te asustan, es posible que comiences a prestarles todavía más atención.",
    herramienta: "Respiración lenta y cómoda",
    herramientaComo:
      "Durante unos minutos, prueba respirar de manera lenta y cómoda, sin forzar la respiración. Puedes permitir que la exhalación sea ligeramente más larga que la inhalación si se siente natural para ti. El objetivo no es obligar a la ansiedad a desaparecer, sino crear un momento de regulación.",
  },
};

export const TEXTO_NIVEL: Record<NivelKey, { titulo: string; mensaje: string }> = {
  calma: {
    titulo: "Las señales aparecen de forma ocasional",
    mensaje:
      "Tus respuestas muestran algunas señales relacionadas con ansiedad, pero parecen aparecer con menor frecuencia o impacto. Este puede ser un buen momento para conocer mejor tu patrón, observar qué suele activarlo y comenzar a desarrollar herramientas para cuidar tu salud mental. No necesitas esperar a sentirte mal para comenzar a cuidarte.",
  },
  alerta: {
    titulo: "La ansiedad ya está pidiendo un poco más de atención",
    mensaje:
      "Tus respuestas muestran señales relacionadas con ansiedad que aparecen con cierta frecuencia y podrían estar requiriendo energía para gestionarlas. Vale la pena prestarles atención. Puedes comenzar explorando algunas de las herramientas de tu resultado y, si notas que la ansiedad continúa, aumenta o comienza a interferir con áreas importantes de tu vida, conversar con un profesional puede ayudarte a comprender mejor qué está ocurriendo.",
  },
  sobrecarga: {
    titulo: "La ansiedad está interfiriendo en algunas áreas de tu vida",
    mensaje:
      "Tus respuestas reflejan señales frecuentes de ansiedad y posible interferencia en áreas como el descanso, la concentración, tus decisiones, tus relaciones o las cosas que haces y dejas de hacer. En este punto, buscar apoyo profesional puede ser especialmente útil para comprender lo que estás viviendo y trabajar con herramientas adaptadas a ti. No tienes que esperar a estar peor para pedir ayuda.",
  },
  alarma: {
    titulo: "Tus respuestas indican que sería importante buscar apoyo profesional",
    mensaje:
      "Tus respuestas reflejan un nivel alto y frecuente de malestar o señales de una interferencia importante en tu día a día. Este test no puede determinar qué está ocurriendo clínicamente, pero sí puede ayudarte a reconocer que sería recomendable conversar con un profesional de salud mental. Existen tratamientos eficaces para distintos problemas relacionados con la ansiedad. Un profesional puede evaluar tu situación de manera individual y ayudarte a determinar qué tipo de apoyo tiene más sentido para ti.",
  },
};

const ESPECIALISTA: Record<PerfilKey, string> = {
  rumia: "Valentina Tello",
  somatica: "Valentina Tello",
  social: "Valentina Tello",
  control: "Luisa Reyes",
  rendimiento: "Barbara Serrano",
};

type PerfilKey = keyof typeof PERFILES;
type NivelKey = keyof typeof NIVELES;

/**
 * "parcial": se envía apenas la persona deja sus datos (antes de terminar el
 * test), para tener el contacto aunque abandone. "completo": al ver el resultado.
 */
type Estado = "parcial" | "completo";

interface Contacto {
  nombre: string;
  apellido: string;
  email: string;
  whatsapp: string;
}

interface LeadParcial extends Contacto {
  estado: "parcial";
}

interface LeadCompleto extends Contacto {
  estado: "completo";
  perfilKey: PerfilKey;
  nivelKey: NivelKey;
  puntaje: number;
  subescalas: Record<PerfilKey, number>;
  showSupport: boolean;
}

type Lead = LeadParcial | LeadCompleto;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+\d{8,15}$/;

function pct(n: unknown): number {
  return typeof n === "number" && Number.isFinite(n)
    ? Math.min(100, Math.max(0, Math.round(n)))
    : 0;
}

/** Texto libre del cliente: sin caracteres de control y con largo acotado. */
function texto(v: unknown): string {
  return typeof v === "string"
    ? v
        .replace(/\p{Cc}/gu, "")
        .trim()
        .slice(0, 80)
    : "";
}

/** Valida el body. Nada del cliente pasa al CRM sin whitelist ni límites. */
export function parseLead(raw: unknown): Lead | null {
  let body = raw;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) return null;

  const whatsapp = typeof b.whatsapp === "string" ? b.whatsapp.replace(/[^\d+]/g, "") : "";
  if (whatsapp && !PHONE_RE.test(whatsapp)) return null;

  // Sin forma de contactar a la persona no hay nada que guardar en el CRM.
  if (!email && !whatsapp) return null;

  const nombre = texto(b.nombre);
  const apellido = texto(b.apellido);

  // Sin estado explícito se asume "completo" (compatibilidad con clientes en caché).
  const estado: Estado = b.estado === "parcial" ? "parcial" : "completo";
  if (estado === "parcial") return { estado, nombre, apellido, email, whatsapp };

  if (typeof b.perfilKey !== "string" || !(b.perfilKey in PERFILES)) return null;
  if (typeof b.nivelKey !== "string" || !(b.nivelKey in NIVELES)) return null;

  const s = (b.subescalas && typeof b.subescalas === "object" ? b.subescalas : {}) as Record<
    string,
    unknown
  >;
  const subescalas = {
    rumia: pct(s.rumia),
    control: pct(s.control),
    social: pct(s.social),
    rendimiento: pct(s.rendimiento),
    somatica: pct(s.somatica),
  };

  return {
    estado,
    nombre,
    apellido,
    email,
    whatsapp,
    perfilKey: b.perfilKey as PerfilKey,
    nivelKey: b.nivelKey as NivelKey,
    puntaje: pct(b.puntaje),
    subescalas,
    showSupport: b.showSupport === true,
  };
}

/** Payload plano que recibe GoHighLevel (claves en snake_case para mapear fácil). */
export function buildWebhookPayload(lead: LeadParcial, fecha?: string): PayloadParcial;
export function buildWebhookPayload(lead: LeadCompleto, fecha?: string): PayloadCompleto;
export function buildWebhookPayload(lead: Lead, fecha?: string): PayloadParcial | PayloadCompleto;
export function buildWebhookPayload(lead: Lead, fecha = new Date().toISOString()) {
  if (lead.estado === "parcial") return buildParcial(lead, fecha);
  return buildCompleto(lead, fecha);
}

type PayloadParcial = ReturnType<typeof buildParcial>;
type PayloadCompleto = ReturnType<typeof buildCompleto>;

function buildContacto(lead: Lead) {
  // Clientes viejos (en caché) mandan todo en `nombre`: se parte en nombre + apellido.
  const [primero, ...resto] = lead.nombre.split(/\s+/).filter(Boolean);
  const firstName = lead.apellido ? lead.nombre : primero;
  const lastName = lead.apellido || resto.join(" ");
  // Contacto (se omiten los vacíos para no borrar datos existentes en GHL)
  return {
    ...(firstName ? { first_name: firstName } : {}),
    ...(lastName ? { last_name: lastName } : {}),
    ...(lead.email ? { email: lead.email } : {}),
    ...(lead.whatsapp ? { phone: lead.whatsapp } : {}),
    source: "test-ansiedad",
  };
}

/** Sin campos de resultado: aún no existe y no deben pisar uno anterior en GHL. */
function buildParcial(lead: LeadParcial, fecha: string) {
  return {
    ...buildContacto(lead),
    estado: "parcial" as const,
    tags: "quiz-ansiedad,quiz-incompleto",
    fecha,
  };
}

function buildCompleto(lead: LeadCompleto, fecha: string) {
  const perfil = PERFILES[lead.perfilKey];
  const nivel = NIVELES[lead.nivelKey];

  const tags = ["quiz-ansiedad", "quiz-completado", `ansiedad-${lead.perfilKey}`, `nivel-${lead.nivelKey}`];
  if (lead.showSupport) tags.push("quiz-requiere-apoyo");

  const resumen = [
    "Test de ansiedad (test.insside.co)",
    `Perfil dominante: ${perfil}`,
    `Nivel: ${nivel} (${lead.puntaje}/100)`,
    `Desglose: ${(Object.keys(PERFILES) as PerfilKey[])
      .map((k) => `${PERFILES[k]} ${lead.subescalas[k]}%`)
      .join(" · ")}`,
    `Especialista sugerido: ${ESPECIALISTA[lead.perfilKey]}`,
    lead.showSupport ? "⚠️ Marcó señales que ameritan seguimiento pronto." : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ...buildContacto(lead),
    estado: "completo" as const,
    // Resultado
    perfil,
    perfil_key: lead.perfilKey,
    nivel,
    nivel_key: lead.nivelKey,
    puntaje: lead.puntaje,
    score_rumia: lead.subescalas.rumia,
    score_control: lead.subescalas.control,
    score_social: lead.subescalas.social,
    score_rendimiento: lead.subescalas.rendimiento,
    score_somatica: lead.subescalas.somatica,
    requiere_apoyo: lead.showSupport ? "si" : "no",
    especialista_recomendado: ESPECIALISTA[lead.perfilKey],
    // Textos listos para el correo de resultados
    perfil_descripcion: TEXTO_PERFIL[lead.perfilKey].descripcion,
    nivel_titulo: TEXTO_NIVEL[lead.nivelKey].titulo,
    nivel_mensaje: TEXTO_NIVEL[lead.nivelKey].mensaje,
    herramienta: TEXTO_PERFIL[lead.perfilKey].herramienta,
    herramienta_como: TEXTO_PERFIL[lead.perfilKey].herramientaComo,
    // Ayudas para el workflow
    tags: tags.join(","),
    resumen,
    fecha,
  };
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[lead] Falta GHL_WEBHOOK_URL en el entorno");
    return res.status(500).json({ error: "CRM no configurado" });
  }

  const lead = parseLead(req.body);
  if (!lead) return res.status(400).json({ error: "Datos inválidos" });

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildWebhookPayload(lead)),
    });
    if (!r.ok) {
      console.error("[lead] GHL webhook error:", r.status, await r.text().catch(() => ""));
      return res.status(502).json({ error: "No se pudo guardar en el CRM" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[lead] Error enviando a GHL:", err);
    return res.status(502).json({ error: "No se pudo guardar en el CRM" });
  }
}
