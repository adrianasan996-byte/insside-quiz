import { useCallback, useMemo, useState } from "react";
import {
  INTERSTITIAL_AFTER_SECTION,
  QUESTIONS,
  SECTIONS,
} from "../data/questions";
import { defaultCountry } from "../lib/phone";
import type { Answers, LikertValue, Lead } from "../types";

export type Step =
  | { kind: "intro" }
  | { kind: "section-intro"; sectionIndex: number }
  | { kind: "question"; questionId: string; sectionIndex: number; nthInSection: number }
  | { kind: "interstitial"; which: "dinamico1" | "dinamico2" }
  | { kind: "lead" }
  | { kind: "result" };

/** Índice de sección tras la cual se pide el email/WhatsApp (0-indexed). */
const LEAD_AFTER_SECTION = 0;

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: "intro" }];
  SECTIONS.forEach((_, sectionIndex) => {
    steps.push({ kind: "section-intro", sectionIndex });
    const qs = QUESTIONS.filter((q) => q.section === sectionIndex);
    qs.forEach((q, i) => {
      steps.push({
        kind: "question",
        questionId: q.id,
        sectionIndex,
        nthInSection: i,
      });
    });
    if (sectionIndex === LEAD_AFTER_SECTION) steps.push({ kind: "lead" });
    const inter = INTERSTITIAL_AFTER_SECTION[sectionIndex];
    if (inter) steps.push({ kind: "interstitial", which: inter });
  });
  steps.push({ kind: "result" });
  return steps;
}

const TOTAL_QUESTIONS = QUESTIONS.length;

const emptyLead = (): Lead => ({
  nombre: "",
  apellido: "",
  email: "",
  whatsappPais: defaultCountry(),
  whatsappLocal: "",
});

export interface QuizMachine {
  step: Step;
  stepIndex: number;
  totalSteps: number;
  direction: 1 | -1;
  answers: Answers;
  answeredCount: number;
  totalQuestions: number;
  progress: number; // 0..1 sobre las preguntas
  activeSectionIndex: number; // 0..4, para la barra
  lead: Lead;
  canGoBack: boolean;
  setAnswer: (id: string, value: LikertValue) => void;
  setLead: (lead: Lead) => void;
  next: () => void;
  back: () => void;
  restart: () => void;
}

export function useQuizMachine(): QuizMachine {
  const steps = useMemo(buildSteps, []);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLeadState] = useState<Lead>(emptyLead);

  const step = steps[stepIndex];

  const answeredCount = useMemo(
    () => QUESTIONS.filter((q) => answers[q.id] !== undefined).length,
    [answers],
  );

  const activeSectionIndex = useMemo(() => {
    if (step.kind === "section-intro" || step.kind === "question") {
      return step.sectionIndex;
    }
    if (step.kind === "interstitial") {
      return step.which === "dinamico1" ? 2 : 4;
    }
    if (step.kind === "intro") return 0;
    if (step.kind === "lead") return LEAD_AFTER_SECTION;
    return SECTIONS.length - 1;
  }, [step]);

  const next = useCallback(() => {
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const back = useCallback(() => {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setDirection(-1);
    setAnswers({});
    setLeadState(emptyLead());
    setStepIndex(0);
  }, []);

  const setAnswer = useCallback((id: string, value: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const setLead = useCallback((next: Lead) => setLeadState(next), []);

  return {
    step,
    stepIndex,
    totalSteps: steps.length,
    direction,
    answers,
    answeredCount,
    totalQuestions: TOTAL_QUESTIONS,
    progress: answeredCount / TOTAL_QUESTIONS,
    activeSectionIndex,
    lead,
    canGoBack: stepIndex > 0 && step.kind !== "result",
    setAnswer,
    setLead,
    next,
    back,
    restart,
  };
}
