/**
 * Google Analytics 4 (misma propiedad que insside.co). El Measurement ID es
 * público por diseño: viaja en el HTML de cualquier sitio con GA.
 * Vacío = GA desactivado (no se carga nada).
 */
const GA_ID = "G-J4S881CG4W";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined" || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js espera el objeto `arguments`, no un array.
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

/** Embudo del quiz: quiz_inicio → quiz_lead → quiz_completado. Nunca lanza. */
export function track(event: string, params?: Record<string, string | number>) {
  try {
    window.gtag?.("event", event, params);
  } catch {
    /* analytics nunca rompe el quiz */
  }
}
