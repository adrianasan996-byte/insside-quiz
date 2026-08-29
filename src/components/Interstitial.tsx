import { motion } from "framer-motion";
import type { InterstitialContent } from "../data/interstitials";

interface InterstitialProps {
  content: InterstitialContent;
  illustration?: string;
  onContinue: () => void;
}

export function Interstitial({ content, illustration, onContinue }: InterstitialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="quiz-card overflow-hidden p-6 sm:p-9"
    >
      {illustration ? (
        <div className="mb-5 flex justify-center">
          <img
            src={illustration}
            alt=""
            aria-hidden
            className="h-28 w-auto opacity-90 sm:h-32"
            draggable={false}
          />
        </div>
      ) : null}

      <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-salvia-deep">
        {content.eyebrow}
      </p>
      <h2 className="mt-3 text-balance text-[26px] font-bold leading-snug text-ink sm:text-3xl">
        {content.title}
      </h2>

      <div className="mt-5 space-y-4">
        {content.body.map((p, i) => (
          <p key={i} className="text-pretty font-sans text-[15px] leading-relaxed text-ink-soft">
            {p}
          </p>
        ))}
      </div>

      {content.note ? (
        <div className="mt-6 rounded-2xl border border-salvia/60 bg-salvia-wash/70 p-4">
          <p className="font-sans text-[13.5px] leading-relaxed text-ink">
            <span className="font-semibold">Dato · </span>
            {content.note}
          </p>
        </div>
      ) : null}

      <div className="mt-8">
        <button className="btn-primary" onClick={onContinue} autoFocus>
          {content.cta}
        </button>
      </div>
    </motion.div>
  );
}
