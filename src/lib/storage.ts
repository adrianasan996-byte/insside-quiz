import type { Lead, ScoreResult } from "../types";
import { RESULTS } from "../data/results";

const LEAD_KEY = "insside_quiz_lead";
const RESULT_KEY = "insside_quiz_result";

const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK as string | undefined;

export interface StoredPayload {
  nombre: string;
  email: string;
  perfil: string;
  nivel: string;
  puntaje: number;
  subescalas: ScoreResult["subscales"];
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
 * Guarda lead + resultado en localStorage y, si hay `VITE_LEAD_WEBHOOK`
 * configurado, hace un POST con el payload. Nunca lanza: la UI sigue igual
 * aunque el webhook falle.
 */
export async function submitLead(lead: Lead, score: ScoreResult): Promise<void> {
  const payload: StoredPayload = {
    nombre: lead.nombre.trim(),
    email: lead.email.trim(),
    perfil: RESULTS[score.primary].titulo,
    nivel: score.level.label,
    puntaje: score.total,
    subescalas: score.subscales,
    fecha: new Date().toISOString(),
  };

  safeSet(LEAD_KEY, lead);
  safeSet(RESULT_KEY, payload);

  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    /* sin conexión / CORS: el dato ya quedó en localStorage */
  }
}
