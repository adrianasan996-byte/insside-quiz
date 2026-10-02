import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { formatLocal, isValidWhatsapp } from "../lib/phone";
import { EMAIL_RE, sugerirEmail } from "../lib/email";
import type { Lead } from "../types";
import { CountrySelect } from "./CountrySelect";

interface LeadCaptureProps {
  lead: Lead;
  onChange: (lead: Lead) => void;
  onSubmit: () => void;
}

/** Dominios ya consultados en /api/verificar-email (true = recibe correo). */
const dominiosVistos = new Map<string, boolean>();

async function dominioValido(dominio: string): Promise<boolean> {
  // `npm run dev` (Vite) no sirve /api: la verificación solo corre en Vercel.
  if (import.meta.env.DEV) return true;
  const cached = dominiosVistos.get(dominio);
  if (cached !== undefined) return cached;
  try {
    const r = await fetch(`/api/verificar-email?dominio=${encodeURIComponent(dominio)}`);
    if (!r.ok) return true; // sin verificación disponible: no bloqueamos
    const { valido } = (await r.json()) as { valido?: boolean };
    dominiosVistos.set(dominio, valido !== false);
    return valido !== false;
  } catch {
    return true;
  }
}

const inputClass =
  "rounded-2xl border bg-natural px-4 py-3 font-sans text-[15px] text-ink outline-none transition focus:border-salvia-deep";

export function LeadCapture({ lead, onChange, onSubmit }: LeadCaptureProps) {
  const [touched, setTouched] = useState({
    nombre: false,
    apellido: false,
    email: false,
    phone: false,
  });
  const [dominioMalo, setDominioMalo] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidoRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const nombreVacio = lead.nombre.trim() === "";
  const apellidoVacio = lead.apellido.trim() === "";
  const email = lead.email.trim().toLowerCase();
  const dominio = email.slice(email.lastIndexOf("@") + 1);
  const emailFormatoMalo = email === "" || !EMAIL_RE.test(email);
  const emailDominioMalo = !emailFormatoMalo && dominioMalo === dominio;
  const sugerencia = emailFormatoMalo ? null : sugerirEmail(email);
  const phoneInvalid = !isValidWhatsapp(lead.whatsappPais, lead.whatsappLocal);

  // Si la persona corrige el correo, se olvida el aviso anterior.
  useEffect(() => {
    if (dominioMalo && dominioMalo !== dominio) setDominioMalo(null);
  }, [dominio, dominioMalo]);

  async function verificarDominio(): Promise<boolean> {
    if (emailFormatoMalo) return false;
    const ok = await dominioValido(dominio);
    setDominioMalo(ok ? null : dominio);
    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ nombre: true, apellido: true, email: true, phone: true });
    if (nombreVacio) return nombreRef.current?.focus();
    if (apellidoVacio) return apellidoRef.current?.focus();
    if (emailFormatoMalo) return emailRef.current?.focus();
    if (phoneInvalid) return phoneRef.current?.focus();
    setVerificando(true);
    const ok = await verificarDominio();
    setVerificando(false);
    if (!ok) return emailRef.current?.focus();
    onSubmit();
  }

  const errorNombre = touched.nombre && nombreVacio ? "Escribe tu nombre." : null;
  const errorApellido = touched.apellido && apellidoVacio ? "Escribe tu apellido." : null;

  const errorEmail = !touched.email
    ? null
    : email === ""
      ? "Escribe tu correo."
      : emailFormatoMalo
        ? "Revisa el correo: debe tener la forma nombre@dominio.com."
        : emailDominioMalo
          ? `El dominio «${dominio}» no existe o no recibe correos. Revisa cómo lo escribiste.`
          : null;

  const errorPhone = !touched.phone
    ? null
    : lead.whatsappLocal.trim() === ""
      ? "Escribe tu número de WhatsApp."
      : phoneInvalid
        ? "Este número no parece un celular válido para el país elegido. Revisa los dígitos o el país."
        : null;

  return (
    <motion.form
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      noValidate
      className="quiz-card p-6 sm:p-9"
    >
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-salvia-deep">
        Antes de seguir
      </p>
      <h2 className="mt-3 text-balance text-[26px] font-bold leading-snug text-ink sm:text-3xl">
        ¿A nombre de quién es este resultado?
      </h2>
      <p className="mt-3 text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        Necesitamos tu email y tu WhatsApp para poder enviarte tu resultado completo y las
        herramientas, apenas termines el test.
      </p>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-sans text-[13px] font-medium text-ink">Tu nombre</span>
            <input
              ref={nombreRef}
              type="text"
              value={lead.nombre}
              onChange={(e) => onChange({ ...lead, nombre: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
              autoComplete="given-name"
              placeholder="Nombre"
              aria-invalid={!!errorNombre}
              className={`mt-1.5 w-full ${inputClass} ${errorNombre ? "border-lvl-alarma" : "border-natural"}`}
            />
            {errorNombre ? (
              <span className="mt-1 block font-sans text-xs text-lvl-alarma">{errorNombre}</span>
            ) : null}
          </label>

          <label className="block">
            <span className="font-sans text-[13px] font-medium text-ink">Tu apellido</span>
            <input
              ref={apellidoRef}
              type="text"
              value={lead.apellido}
              onChange={(e) => onChange({ ...lead, apellido: e.target.value })}
              onBlur={() => setTouched((t) => ({ ...t, apellido: true }))}
              autoComplete="family-name"
              placeholder="Apellido"
              aria-invalid={!!errorApellido}
              className={`mt-1.5 w-full ${inputClass} ${errorApellido ? "border-lvl-alarma" : "border-natural"}`}
            />
            {errorApellido ? (
              <span className="mt-1 block font-sans text-xs text-lvl-alarma">{errorApellido}</span>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className="font-sans text-[13px] font-medium text-ink">Tu email</span>
          <input
            ref={emailRef}
            type="email"
            value={lead.email}
            onChange={(e) => onChange({ ...lead, email: e.target.value })}
            onBlur={() => {
              setTouched((t) => ({ ...t, email: true }));
              void verificarDominio();
            }}
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="tucorreo@ejemplo.com"
            aria-invalid={!!errorEmail}
            className={`mt-1.5 w-full ${inputClass} ${errorEmail ? "border-lvl-alarma" : "border-natural"}`}
          />
          {sugerencia ? (
            <span className="mt-1.5 block font-sans text-[13px] text-ink-soft">
              ¿Quisiste decir{" "}
              <button
                type="button"
                onClick={() => onChange({ ...lead, email: sugerencia })}
                className="font-semibold text-salvia-deep underline underline-offset-2"
              >
                {sugerencia}
              </button>
              ?
            </span>
          ) : null}
          {errorEmail ? (
            <span className="mt-1 block font-sans text-xs text-lvl-alarma">{errorEmail}</span>
          ) : null}
        </label>

        <div>
          <label htmlFor="whatsapp" className="font-sans text-[13px] font-medium text-ink">
            Tu WhatsApp
          </label>
          <div className="mt-1.5 flex gap-2">
            <CountrySelect
              value={lead.whatsappPais}
              onChange={(iso) => onChange({ ...lead, whatsappPais: iso })}
              className={`border-natural ${inputClass}`}
            />
            <input
              ref={phoneRef}
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={lead.whatsappLocal}
              onChange={(e) => onChange({ ...lead, whatsappLocal: e.target.value })}
              onBlur={() => {
                setTouched((t) => ({ ...t, phone: true }));
                if (!phoneInvalid) {
                  onChange({
                    ...lead,
                    whatsappLocal: formatLocal(lead.whatsappPais, lead.whatsappLocal),
                  });
                }
              }}
              autoComplete="tel-national"
              placeholder="Tu número, sin el código"
              aria-invalid={!!errorPhone}
              className={`min-w-0 flex-1 ${inputClass} ${errorPhone ? "border-lvl-alarma" : "border-natural"}`}
            />
          </div>
          {errorPhone ? (
            <span className="mt-1 block font-sans text-xs text-lvl-alarma">{errorPhone}</span>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={verificando}
        className="btn-primary mt-7 w-full py-3.5 text-base disabled:opacity-70"
      >
        {verificando ? "Verificando…" : "Ver mi resultado"}
      </button>

      <p className="mt-4 font-sans text-xs leading-relaxed text-ink-faint">
        Al continuar aceptas que Insside use estos datos para enviarte tu resultado y contactarte
        por email o WhatsApp. Puedes pedir que dejemos de escribirte cuando quieras. No vendemos tu
        información.
      </p>
    </motion.form>
  );
}
