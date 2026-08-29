import { useState } from "react";
import { motion } from "framer-motion";
import type { Lead } from "../types";

interface LeadCaptureProps {
  lead: Lead;
  onChange: (lead: Lead) => void;
  onSubmit: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadCapture({ lead, onChange, onSubmit }: LeadCaptureProps) {
  const [touched, setTouched] = useState(false);
  const emailInvalid = lead.email.trim() !== "" && !EMAIL_RE.test(lead.email.trim());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (emailInvalid) return;
    onSubmit();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="quiz-card p-6 sm:p-9"
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-salvia-deep">
        Último paso
      </p>
      <h2 className="mt-3 text-balance text-[26px] font-bold leading-snug text-ink sm:text-3xl">
        ¿A nombre de quién es este resultado?
      </h2>
      <p className="mt-3 text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        Personalizamos tu mini-diagnóstico y, si quieres, te lo enviamos por correo junto con las
        herramientas para que las tengas a mano.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="font-sans text-[13px] font-medium text-ink">Tu nombre</span>
          <input
            type="text"
            value={lead.nombre}
            onChange={(e) => onChange({ ...lead, nombre: e.target.value })}
            autoComplete="given-name"
            placeholder="Cómo te llamas"
            className="mt-1.5 w-full rounded-2xl border border-natural bg-natural px-4 py-3 font-sans text-[15px] text-ink outline-none transition focus:border-salvia-deep"
          />
        </label>

        <label className="block">
          <span className="font-sans text-[13px] font-medium text-ink">
            Tu email <span className="font-normal text-ink-faint">· opcional</span>
          </span>
          <input
            type="email"
            value={lead.email}
            onChange={(e) => onChange({ ...lead, email: e.target.value })}
            onBlur={() => setTouched(true)}
            autoComplete="email"
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={touched && emailInvalid}
            className={
              "mt-1.5 w-full rounded-2xl border bg-natural px-4 py-3 font-sans text-[15px] text-ink outline-none transition focus:border-salvia-deep " +
              (touched && emailInvalid ? "border-lvl-alarma" : "border-natural")
            }
          />
          {touched && emailInvalid ? (
            <span className="mt-1 block font-sans text-xs text-lvl-alarma">
              Revisa el formato del correo.
            </span>
          ) : null}
        </label>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full py-3.5 text-base">
        Ver mi resultado
      </button>

      <p className="mt-4 font-sans text-xs leading-relaxed text-ink-faint">
        Al continuar aceptas que Insside use estos datos para enviarte tu resultado y contenido
        relacionado. Puedes darte de baja cuando quieras. No compartimos tu información con terceros.
      </p>
    </motion.form>
  );
}
