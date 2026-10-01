import { motion } from "framer-motion";
import { HOW_TO_ANSWER, LIKERT, QUESTIONS } from "../data/questions";
import { ILLUSTRATION } from "../data/assets";

interface IntroScreenProps {
  onStart: () => void;
}

const META = [
  `${QUESTIONS.length} preguntas`,
  "4 minutos",
  "Resultado personalizado + herramientas",
];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <img
        src={ILLUSTRATION.abrazo}
        alt=""
        aria-hidden
        draggable={false}
        className="mx-auto h-48 w-auto sm:h-60"
      />

      <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-wide text-salvia-deep">
        Insside · Test
      </p>

      <h1 className="mx-auto mt-4 max-w-[18ch] text-balance bg-gradient-to-r from-salvia-deep via-balance to-terracota bg-clip-text text-[34px] font-bold leading-[1.06] text-transparent sm:text-5xl">
        ¿Qué tipo de ansiedad controla tu vida?
      </h1>

      <div className="mx-auto mt-5 max-w-readable space-y-3 text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        <p>
          Sentir ansiedad es parte de ser humanos. Pero cuando aparece con frecuencia, puede influir
          en cómo duermes, lo que evitas, las decisiones que tomas o cuánto te exiges.
        </p>
        <p>
          Este test te ayuda a reconocer <em>qué patrón de ansiedad pesa más en tu día a día</em>,
          cuánto espacio ocupa y qué herramientas puedes empezar a explorar.
        </p>
      </div>

      <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
        {META.map((m, i) => (
          <li
            key={m}
            className={
              "pill border " +
              (i === META.length - 1
                ? "border-transparent bg-salvia-wash font-semibold text-salvia-deep"
                : "border-natural bg-white text-ink-soft")
            }
          >
            {m}
          </li>
        ))}
      </ul>

      <div className="mt-9">
        <button className="btn-primary px-8 py-3.5 text-base" onClick={onStart}>
          Empezar el test
        </button>
      </div>

      <p className="mx-auto mt-5 max-w-readable text-balance font-sans text-xs leading-relaxed text-ink-faint">
        <strong className="font-semibold">Importante:</strong> no es un diagnóstico clínico ni
        reemplaza a un profesional. Es una herramienta de autoconocimiento basada en TCC y ACT, e
        inspirada en escalas como el GAD-7.
      </p>

      <details className="group mx-auto mt-8 max-w-readable rounded-3xl border border-natural bg-natural/60 text-left">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 font-sans text-xs font-semibold uppercase tracking-wide text-salvia-deep [&::-webkit-details-marker]:hidden">
          {HOW_TO_ANSWER.title}
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </summary>
        <div className="px-5 pb-5">
          <p className="font-sans text-[13.5px] leading-relaxed text-ink-soft">
            {HOW_TO_ANSWER.intro}
          </p>
          <ul className="mt-3 space-y-2">
            {LIKERT.map((opt) => (
              <li key={opt.value} className="font-sans text-[13.5px] leading-snug text-ink-soft">
                <span className="font-semibold text-ink">
                  {opt.value} — {opt.label}
                </span>{" "}
                {opt.days}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink-faint">
            {HOW_TO_ANSWER.closing}
          </p>
        </div>
      </details>
    </motion.div>
  );
}
