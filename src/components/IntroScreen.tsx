import { motion } from "framer-motion";
import { QUESTIONS } from "../data/questions";
import { ILLUSTRATION } from "../data/assets";

interface IntroScreenProps {
  onStart: () => void;
}

const META = [
  `${QUESTIONS.length} preguntas`,
  "4 minutos",
  "Mini-diagnóstico + herramientas",
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
        Sentir ansiedad es normal. Pero cuando aparece casi todos los días y empieza a decidir por
        ti —qué evitas, cómo duermes, cuánto te exiges— deja de ser un estado pasajero. Este test
        te ayuda a ver <em>qué patrón</em> de ansiedad pesa más en tu día a día y qué hacer con él.
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
        No es un diagnóstico clínico. Es una herramienta de autoconocimiento basada en modelos de
        psicología (TCC y ACT) e inspirada en escalas como el GAD-7.
      </p>
    </motion.div>
  );
}
