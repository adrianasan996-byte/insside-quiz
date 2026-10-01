import type { Lead, ScoreResult } from "../types";
import { RESULTS } from "../data/results";
import { whatsappE164 } from "./phone";

const LEAD_KEY = "insside_quiz_lead";
const RESULT_KEY = "insside_quiz_result";

/**
 * Endpoint serverless propio (api/lead.ts) que reenvía al webhook de
 * GoHighLevel. La URL del webhook vive solo en el servidor.
 */
const LEAD_ENDPOINT = "/api/lead";

export interface StoredPayload {
  nombre: string;
  email: string;
  whatsapp: string;
  perfil: string;
  perfilKey: string;
  nivel: string;
  nivelKey: string;
  puntaje: number;
  subescalas: ScoreResult["subscales"];
  showSupport: boolean;
  fecha: string;
}

function safeSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* modo incógnito / storage lleno: no bloquea el quiz */
  }
}

export function readLead(): Lead | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as Lead) : null;
  } catch {
    return null;
  }
}

/**
 * Guarda lead + resultado en localStorage y, si la persona dejó email o
 * WhatsApp, lo envía a /api/lead (→ CRM). Nunca lanza: la UI sigue igual
 * aunque el envío falle.
 */
export async function submitLead(lead: Lead, score: ScoreResult): Promise<void> {
  const payload: StoredPayload = {
    nombre: lead.nombre.trim(),
    email: lead.email.trim(),
    whatsapp: whatsappE164(lead.whatsappPais, lead.whatsappLocal),
    perfil: RESULTS[score.primary].titulo,
    perfilKey: score.primary,
    nivel: score.level.label,
    nivelKey: score.level.key,
    puntaje: score.total,
    subescalas: score.subscales,
    showSupport: score.showSupport,
    fecha: new Date().toISOString(),
  };

  safeSet(LEAD_KEY, lead);
  safeSet(RESULT_KEY, payload);

  // Sin forma de contactar a la persona no hay nada que mandar al CRM.
  if (!payload.email && !payload.whatsapp) return;

  try {
    await fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    /* sin conexión: el dato ya quedó en localStorage */
  }
}
