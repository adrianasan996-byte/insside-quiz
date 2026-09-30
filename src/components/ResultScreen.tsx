import { useState } from "react";
import { motion } from "framer-motion";
import {
  DISCLAIMER,
  EDITORIAL,
  LEVEL_COPY,
  LEVEL_DISCLAIMER,
  REFERENCES,
  RESULTS,
  SUPPORT_BOX,
} from "../data/results";
import { whatsappLink } from "../data/specialists";
import type { ScoreResult } from "../types";
import { ILLUSTRATION } from "../data/assets";
import { ScoreDial } from "./ScoreDial";
import { TypeBars } from "./TypeBars";
import { SpecialistCard } from "./SpecialistCard";

interface ResultScreenProps {
  score: ScoreResult;
  nombre: string;
  onRestart: () => void;
}

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export function ResultScreen({ score, nombre, onRestart }: ResultScreenProps) {
  const [copied, setCopied] = useState(false);
  const primary = RESULTS[score.primary];
  const secondary = RESULTS[score.secondary];
  const levelCopy = LEVEL_COPY[score.level.key];
  const nombreLimpio = nombre.trim();
  const supportWa = whatsappLink({
    especialista: "un profesional",
    perfil: primary.titulo,
    nivel: score.level.label,
    nombre: nombreLimpio || undefined,
  });

  async function share() {
    const text = `Hice el test "¿Qué tipo de ansiedad controla tu vida?" de Insside. Mi perfil: ${primary.titulo} · nivel ${score.level.label}.`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Test de ansiedad · Insside", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* usuario canceló el diálogo de compartir */
    }
  }

  return (
    <div className="w-full">
      {/* ── Encabezado + score ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="quiz-card p-6 text-center sm:p-9"
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-salvia-deep">
          {nombreLimpio ? `${nombreLimpio}, tu resultado` : "Tu resultado"}
        </p>
        <h1 className="mx-auto mt-3 max-w-[22ch] text-balance text-3xl font-bold leading-[1.12] text-ink sm:text-[40px]">
          {levelCopy.headline}
        </h1>

        <div className="mt-8">
          <ScoreDial score={score.total} level={score.level} />
        </div>

        <p className="mx-auto mt-7 max-w-readable text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
          {levelCopy.parrafo}
        </p>
        <p className="mx-auto mt-3 max-w-readable font-sans text-[12px] leading-relaxed text-ink-faint">
          {LEVEL_DISCLAIMER}
        </p>
      </motion.div>

      {/* ── Caja de apoyo (si aplica) ── */}
      {score.showSupport ? (
        <motion.div
          {...fade}
          className="mt-4 flex gap-4 rounded-4xl border-2 border-lvl-alarma/70 bg-lvl-alarma/12 p-6"
        >
          <img
            src={ILLUSTRATION.apoyo}
            alt=""
            aria-hidden
            draggable={false}
            className="hidden h-24 w-auto shrink-0 self-center sm:block"
          />
          <div>
            <h2 className="text-lg font-bold text-ink">{SUPPORT_BOX.title}</h2>
            <div className="mt-2 space-y-2">
              {SUPPORT_BOX.body.map((p, i) => (
                <p key={i} className="font-sans text-[14px] leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
            </div>
            <a
              href={supportWa}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-4 inline-flex"
            >
              {SUPPORT_BOX.cta}
            </a>
          </div>
        </motion.div>
      ) : null}

      {/* ── Perfil dominante ── */}
      <motion.section {...fade} className="mt-4 quiz-card p-6 sm:p-9">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-salvia-deep">
          Tu patrón dominante
        </p>
        <h2 className="mt-2 text-[28px] font-bold leading-tight text-ink sm:text-3xl">
          {primary.titulo}
        </h2>
        <p className="mt-1 font-sans text-sm italic text-ink-faint">{primary.tagline}</p>
        <p className="mt-4 text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
          {primary.reconocimiento}
        </p>

        <div className="mt-7">
          <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
            Cómo se reparte tu ansiedad
          </p>
          <TypeBars
            subscales={score.subscales}
            ranked={score.ranked}
            primary={score.primary}
          />
          <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink-faint">
            Tu segundo patrón con más peso es <strong>{secondary.titulo}</strong>. Muchas personas
            tienen una mezcla; lo útil es empezar por el que más te está costando hoy.
          </p>
        </div>
      </motion.section>

      {/* ── Mini-diagnóstico ── */}
      <motion.section {...fade} className="mt-4 quiz-card p-6 sm:p-9">
        <h2 className="text-xl font-bold text-ink">Mini-diagnóstico</h2>
        <div className="mt-4 space-y-4">
          {primary.miniDiagnostico.map((p, i) => (
            <p key={i} className="text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-natural bg-natural p-4">
            <p className="font-sans text-[13px] font-semibold text-ink">Te suena si…</p>
            <ul className="mt-2 space-y-1.5">
              {primary.teSuenaSi.map((s) => (
                <li key={s} className="flex gap-2 font-sans text-[13.5px] leading-snug text-ink-soft">
                  <span aria-hidden className="text-salvia-deep">
                    ·
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-natural bg-natural p-4">
            <p className="font-sans text-[13px] font-semibold text-ink">Qué lo alimenta</p>
            <ul className="mt-2 space-y-1.5">
              {primary.queLoAgrava.map((s) => (
                <li key={s} className="flex gap-2 font-sans text-[13.5px] leading-snug text-ink-soft">
                  <span aria-hidden className="text-salvia-deep">
                    ·
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ── Herramientas ── */}
      <motion.section {...fade} className="mt-4 quiz-card p-6 sm:p-9">
        <h2 className="text-xl font-bold text-ink">
          3 herramientas para tu patrón
        </h2>
        <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-soft">
          No son tips genéricos: son técnicas con respaldo en terapia. Empieza por una, una semana.
        </p>
        <ol className="mt-5 space-y-3">
          {primary.herramientas.map((t, i) => (
            <li key={t.nombre} className="rounded-2xl border border-natural bg-natural p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-salvia-deep font-sans text-[13px] font-bold text-paper">
                  {i + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-sans text-[15px] font-semibold text-ink">{t.nombre}</h3>
                    <span className="pill bg-salvia-wash px-2 py-0.5 text-[11px] font-medium text-salvia-deep">
                      {t.base}
                    </span>
                  </div>
                  <p className="mt-1.5 font-sans text-[14px] leading-relaxed text-ink-soft">
                    {t.como}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* ── Especialista ── */}
      <motion.section {...fade} className="mt-4">
        <SpecialistCard
          primary={score.primary}
          perfil={primary.titulo}
          nivel={score.level.label}
          nombre={nombreLimpio || undefined}
        />
      </motion.section>

      {/* ── Contenido editorial ── */}
      <motion.section {...fade} className="mt-4 quiz-card p-6 sm:p-9">
        <h2 className="text-xl font-bold text-ink">Para seguir leyendo</h2>
        <div className="mt-3 divide-y divide-natural">
          {EDITORIAL.map((sec) => (
            <details key={sec.id} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[15px] font-medium text-ink">
                {sec.title}
                <span
                  aria-hidden
                  className="ml-3 text-ink-faint transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 space-y-3">
                {sec.body.map((p, i) => (
                  <p key={i} className="font-sans text-[14px] leading-relaxed text-ink-soft">
                    {p}
                  </p>
                ))}
                {sec.list ? (
                  <ul className="space-y-1.5 pl-1">
                    {sec.list.map((li) => (
                      <li
                        key={li}
                        className="flex gap-2 font-sans text-[14px] leading-snug text-ink-soft"
                      >
                        <span aria-hidden className="text-salvia-deep">
                          ·
                        </span>
                        {li}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </details>
          ))}

          <details className="group py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-[15px] font-medium text-ink">
              Fuentes
              <span aria-hidden className="ml-3 text-ink-faint transition group-open:rotate-45">
                +
              </span>
            </summary>
            <ul className="mt-3 space-y-2">
              {REFERENCES.map((r, i) => (
                <li key={i} className="font-sans text-[12.5px] leading-relaxed text-ink-faint">
                  {i + 1}. {r}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </motion.section>

      {/* ── Acciones + disclaimer ── */}
      <motion.div {...fade} className="mt-6 flex flex-col items-center gap-3">
        <div className="flex flex-wrap justify-center gap-2.5">
          <button className="btn-ghost" onClick={share}>
            {copied ? "Copiado ✓" : "Compartir mi resultado"}
          </button>
          <button className="btn-ghost" onClick={onRestart}>
            Volver a hacer el test
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-[52ch] text-center font-sans text-[11.5px] leading-relaxed text-ink-faint">
          {DISCLAIMER}
        </p>
      </motion.div>
    </div>
  );
}
