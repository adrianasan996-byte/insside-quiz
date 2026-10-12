import { INSSIDE_ESPECIALISTAS_URL, perfilUrl, whatsappLink } from "../data/specialists";
import type { Specialist } from "../types";

interface SpecialistCardProps {
  especialistas: readonly [Specialist, Specialist];
  perfil: string;
  nivel: string;
  nombre?: string;
}

export function SpecialistCard({ especialistas, perfil, nivel, nombre }: SpecialistCardProps) {
  const wa = whatsappLink({
    especialista: especialistas.map((e) => e.nombre).join(" o "),
    perfil,
    nivel,
    nombre,
  });

  return (
    <div className="rounded-4xl border border-natural bg-natural p-6 sm:p-7">
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-salvia-deep">
        Tu siguiente paso en Insside
      </p>
      <h3 className="mt-2 text-xl font-bold text-ink">
        Trabajar esto con acompañamiento
      </h3>
      <p className="mt-2 font-sans text-[14.5px] leading-relaxed text-ink-soft">
        Por tu perfil, dentro de Insside encaja especialmente el trabajo con:
      </p>

      <ul className="mt-4 flex flex-col gap-3">
        {especialistas.map((esp) => (
          <li key={esp.slug}>
            <a
              href={perfilUrl(esp.slug)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-natural bg-white p-4 transition-colors hover:border-salvia"
            >
              <div
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full font-sans text-lg font-bold text-paper"
                style={{ backgroundColor: esp.color }}
              >
                {esp.iniciales}
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[15px] font-semibold text-ink">{esp.nombre}</p>
                <p className="font-sans text-[13px] text-ink-soft">{esp.rol}</p>
                <p className="mt-1 font-sans text-[13px] leading-snug text-ink-soft">{esp.enfoque}</p>
                <p className="mt-1 font-sans text-xs text-ink-faint">
                  Sesiones desde ${esp.precioUSD} USD · en español · online · Ver perfil →
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="btn-primary flex-1 py-3.5"
        >
          Escribir por WhatsApp
        </a>
        <a
          href={INSSIDE_ESPECIALISTAS_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost flex-1 justify-center py-3.5"
        >
          Ver todos los especialistas
        </a>
      </div>

      <p className="mt-3 font-sans text-xs text-ink-faint">
        ¿No sabes por dónde empezar? Insside ofrece una sesión exploratoria breve para ayudarte a
        elegir.
      </p>
    </div>
  );
}
