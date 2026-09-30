import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LIKERT } from "../data/questions";
import type { LikertValue, Question, Section } from "../types";

interface QuestionCardProps {
  question: Question;
  section: Section;
  value: LikertValue | undefined;
  nthInSection: number;
  totalInSection: number;
  onAnswer: (value: LikertValue) => void;
  onAdvance: () => void;
}

export function QuestionCard({
  question,
  section,
  value,
  nthInSection,
  totalInSection,
  onAnswer,
  onAdvance,
}: QuestionCardProps) {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function choose(v: LikertValue) {
    onAnswer(v);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(onAdvance, 320);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="quiz-card p-6 sm:p-8"
    >
      <p className="font-sans text-xs font-medium uppercase tracking-wide text-ink-faint">
        {section.prompt}
      </p>

      <h2 className="mt-4 text-balance text-2xl font-semibold leading-snug text-ink sm:text-[27px]">
        {question.text}
      </h2>

      <div className="mt-6 flex flex-col gap-2.5" role="radiogroup" aria-label={question.text}>
        {LIKERT.map((opt, i) => {
          const selected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => choose(opt.value)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.22 }}
              className={
                "group flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left font-sans text-[15px] transition " +
                (selected
                  ? "border-salvia-deep bg-salvia-wash text-ink"
                  : "border-natural bg-natural/60 text-ink-soft hover:border-ink/25 hover:text-ink")
              }
            >
              <span>
                {opt.label}
                <span className="block font-sans text-[12px] font-normal text-ink-faint">
                  {opt.days}
                </span>
              </span>
              <span
                aria-hidden
                className={
                  "ml-3 grid h-5 w-5 shrink-0 place-items-center rounded-full border transition " +
                  (selected ? "border-salvia-deep bg-salvia-deep" : "border-ink/25 group-hover:border-ink/40")
                }
              >
                {selected ? (
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-paper" fill="none">
                    <path
                      d="M2.5 6.5l2.2 2.2L9.5 3.8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 font-sans text-xs text-ink-faint">
        Pregunta {nthInSection + 1} de {totalInSection} · {section.title}
      </p>
    </motion.div>
  );
}
