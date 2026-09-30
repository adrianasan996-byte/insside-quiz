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
        src={ILLUSTRATION.pensamientos}
        alt=""
        aria-hidden
        draggable={false}
        className="mx-auto h-32 w-auto sm:h-40"
      />

      <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-salvia-deep">
        Insside · Test
      </p>

      <h1 className="mx-auto mt-4 max-w-[18ch] text-balance text-[34px] font-bold leading-[1.06] text-ink sm:text-5xl">
        ¿Qué tipo de ansiedad controla tu vida?
      </h1>

      <p className="mx-auto mt-5 max-w-readable text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        Sentir ansiedad es parte de ser humanos. Pero cuando comienza a aparecer con frecuencia
        puede influir en cómo duermes, lo que evitas, las decisiones que tomas o cuánto te exiges.
        Este test puede ayudarte a reconocer{" "}
        <em>qué patrón de ansiedad aparece con más fuerza en tu día a día</em>, cuánto espacio
        podría estar ocupando y qué herramientas puedes comenzar a explorar.
      </p>

      <ul className="mt-7 flex flex-wrap items-center justify-center gap-2">
        {META.map((m) => (
          <li key={m} className="pill border border-natural bg-white text-ink-soft">
            {m}
          </li>
        ))}
      </ul>

      <div className="mt-9">
        <button className="btn-primary px-8 py-3.5 text-base" onClick={onStart}>
          Empezar el test
        </button>
      </div>

      <p className="mx-auto mt-5 max-w-[46ch] font-sans text-xs leading-relaxed text-ink-faint">
        <strong className="font-semibold">Importante:</strong> este test no ofrece un diagnóstico
        clínico ni reemplaza la evaluación de un profesional de salud mental. Es una herramienta de
        autoconocimiento basada en principios utilizados en psicología, como la Terapia
        Cognitivo-Conductual (TCC) y la Terapia de Aceptación y Compromiso (ACT), e inspirada
        parcialmente en escalas de evaluación de ansiedad como el GAD-7.
      </p>

      <div className="mx-auto mt-8 max-w-readable rounded-3xl border border-natural bg-natural/60 p-5 text-left">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-salvia-deep">
          {HOW_TO_ANSWER.title}
        </p>
        <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-ink-soft">
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
    </motion.div>
  );
}
