import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Layout } from "./components/Layout";
import { ProgressBar } from "./components/ProgressBar";
import { IntroScreen } from "./components/IntroScreen";
import { SectionIntro } from "./components/SectionIntro";
import { QuestionCard } from "./components/QuestionCard";
import { Interstitial } from "./components/Interstitial";
import { LeadCapture } from "./components/LeadCapture";
import { ResultScreen } from "./components/ResultScreen";
import { QUESTIONS, SECTIONS } from "./data/questions";
import { INTERSTITIAL_1, INTERSTITIAL_2 } from "./data/interstitials";
import { TYPE_ILLUSTRATION } from "./data/assets";
import { computeScores, partialDominant } from "./lib/scoring";
import { submitLead } from "./lib/storage";
import { useQuizMachine } from "./hooks/useQuizMachine";

const questionById = new Map(QUESTIONS.map((q) => [q.id, q]));
const countBySection = SECTIONS.map(
  (_, i) => QUESTIONS.filter((q) => q.section === i).length,
);

export default function App() {
  const m = useQuizMachine();
  const reduce = useReducedMotion();
  const { step } = m;

  const score = useMemo(
    () => (step.kind === "result" ? computeScores(m.answers) : null),
    [step.kind, m.answers],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [m.stepIndex]);

  const leadSubmitted = useRef(false);
  useEffect(() => {
    if (score && !leadSubmitted.current) {
      leadSubmitted.current = true;
      void submitLead(m.lead, score);
    }
  }, [score, m.lead]);

  const showProgress =
    step.kind === "section-intro" ||
    step.kind === "question" ||
    step.kind === "interstitial";

  const slide = reduce ? 0 : m.direction * 40;

  function handleLeadSubmit() {
    m.next();
  }

  return (
    <Layout
      align={step.kind === "result" ? "top" : "center"}
      header={
        showProgress ? (
          <ProgressBar
            activeSectionIndex={m.activeSectionIndex}
            progress={m.progress}
          />
        ) : null
      }
    >
      {m.canGoBack ? (
        <button
          onClick={m.back}
          className="mb-5 inline-flex items-center gap-1.5 self-start font-sans text-sm font-medium text-ink-faint transition hover:text-ink"
        >
          <span aria-hidden>←</span> Atrás
        </button>
      ) : null}

      <motion.div
        key={m.stepIndex}
        initial={{ x: slide }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {step.kind === "intro" && <IntroScreen onStart={m.next} />}

          {step.kind === "section-intro" && (
            <SectionIntro section={SECTIONS[step.sectionIndex]} onContinue={m.next} />
          )}

          {step.kind === "question" &&
            (() => {
              const q = questionById.get(step.questionId)!;
              return (
                <QuestionCard
                  question={q}
                  section={SECTIONS[step.sectionIndex]}
                  value={m.answers[q.id]}
                  nthInSection={step.nthInSection}
                  totalInSection={countBySection[step.sectionIndex]}
                  onAnswer={(v) => m.setAnswer(q.id, v)}
                  onAdvance={m.next}
                />
              );
            })()}

          {step.kind === "interstitial" &&
            (() => {
              const dom = partialDominant(m.answers);
              return (
                <Interstitial
                  content={
                    step.which === "dinamico1"
                      ? INTERSTITIAL_1[dom]
                      : INTERSTITIAL_2[dom]
                  }
                  illustration={TYPE_ILLUSTRATION[dom]}
                  onContinue={m.next}
                />
              );
            })()}

          {step.kind === "lead" && (
            <LeadCapture lead={m.lead} onChange={m.setLead} onSubmit={handleLeadSubmit} />
          )}

        {step.kind === "result" && score && (
          <ResultScreen score={score} nombre={m.lead.nombre} onRestart={m.restart} />
        )}
      </motion.div>
    </Layout>
  );
}
