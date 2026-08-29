import { motion } from "framer-motion";
import type { Section } from "../types";

interface SectionIntroProps {
  section: Section;
  onContinue: () => void;
}

export function SectionIntro({ section, onContinue }: SectionIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="text-center"
    >
      <span className="text-6xl font-medium text-salvia sm:text-7xl">
        {String(section.index).padStart(2, "0")}
      </span>
      <h2 className="mx-auto mt-3 max-w-[16ch] text-balance text-3xl font-bold leading-tight text-ink sm:text-4xl">
        {section.title}
      </h2>
      <p className="mx-auto mt-4 max-w-readable text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
        {section.tagline}
      </p>
      <div className="mt-8">
        <button className="btn-primary" onClick={onContinue} autoFocus>
          Continuar
        </button>
      </div>
    </motion.div>
  );
}
