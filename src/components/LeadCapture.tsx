import { useState } from "react";
import { motion } from "framer-motion";
import { PAISES, isValidWhatsapp } from "../lib/phone";
import type { Lead } from "../types";

interface LeadCaptureProps {
  lead: Lead;
  onChange: (lead: Lead) => void;
  onSubmit: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-2xl border bg-natural px-4 py-3 font-sans text-[15px] text-ink outline-none transition focus:border-salvia-deep";

export function LeadCapture({ lead, onChange, onSubmit }: LeadCaptureProps) {
  const [touched, setTouched] = useState(false);
  const emailInvalid = lead.email.trim() !== "" && !EMAIL_RE.test(lead.email.trim());
  const phoneInvalid = !isValidWhatsapp(lead.whatsappCode, lead.whatsappLocal);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (emailInvalid || phoneInvalid) return;
    onSubmit();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      noValidate
      className="quiz-card p-6 sm:p-9"
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-salvia-deep">
        Último paso
      </p>
      <h2 className="mt-3 text-balance text-[26px] font-bold leading-snug text-ink sm:text-3xl">
        ¿A nombre de quién es este resultado?
      </h2>
      <p className="mt-3 text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        Personalizamos tu mini-diagnóstico. Si nos dejas tu email o WhatsApp, te enviamos tu
        resultado y las herramientas para que las tengas a mano.
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
            className={`mt-1.5 border-natural ${inputClass}`}
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
            className={`mt-1.5 ${inputClass} ${touched && emailInvalid ? "border-lvl-alarma" : "border-natural"}`}
          />
          {touched && emailInvalid ? (
            <span className="mt-1 block font-sans text-xs text-lvl-alarma">
              Revisa el formato del correo.
            </span>
          ) : null}
        </label>

        <div>
          <label htmlFor="whatsapp" className="font-sans text-[13px] font-medium text-ink">
            Tu WhatsApp <span className="font-normal text-ink-faint">· opcional</span>
          </label>
          <div className="mt-1.5 flex gap-2">
            <select
              aria-label="Código de país"
              value={lead.whatsappCode}
              onChange={(e) => onChange({ ...lead, whatsappCode: e.target.value })}
              className={`w-[7.5rem] shrink-0 cursor-pointer border-natural ${inputClass}`}
            >
              {PAISES.map((p) => (
                <option key={p.iso} value={p.code}>
                  {p.flag} {p.iso} {p.code}
                </option>
              ))}
            </select>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={lead.whatsappLocal}
              onChange={(e) => onChange({ ...lead, whatsappLocal: e.target.value })}
              onBlur={() => setTouched(true)}
              autoComplete="tel-national"
              placeholder="412 123 4567"
              aria-invalid={touched && phoneInvalid}
              className={`min-w-0 flex-1 ${inputClass} ${touched && phoneInvalid ? "border-lvl-alarma" : "border-natural"}`}
            />
          </div>
          {touched && phoneInvalid ? (
            <span className="mt-1 block font-sans text-xs text-lvl-alarma">
              Revisa el número (sin el código de país).
            </span>
          ) : null}
        </div>
      </div>

      <button type="submit" className="btn-primary mt-7 w-full py-3.5 text-base">
        Ver mi resultado
      </button>

      <p className="mt-4 font-sans text-xs leading-relaxed text-ink-faint">
        Al continuar aceptas que Insside use estos datos para enviarte tu resultado y contactarte
        por email o WhatsApp. Puedes pedir que dejemos de escribirte cuando quieras. No vendemos
        tu información.
      </p>
    </motion.form>
  );
}
