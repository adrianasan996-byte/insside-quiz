import { useEffect, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { SEVERITY_LEVELS } from "../lib/scoring";
import type { SeverityLevel } from "../types";

interface ScoreDialProps {
  score: number; // 0..100
  level: SeverityLevel;
}

const LEVEL_FILL: Record<string, string> = {
  calma: "#C4D0A6",
  alerta: "#E8D6A2",
  sobrecarga: "#E9B583",
  alarma: "#D98E77",
};

const R = 84;
const C = 2 * Math.PI * R;

export function ScoreDial({ score, level }: ScoreDialProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? score : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(score);
      return;
    }
    const controls = animate(0, score, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, reduce]);

  const fill = LEVEL_FILL[level.key] ?? LEVEL_FILL.alerta;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[208px] w-[208px]">
        <svg viewBox="0 0 208 208" className="h-full w-full -rotate-90">
          <circle cx="104" cy="104" r={R} fill="none" stroke="#EDE7E1" strokeWidth="14" />
          <motion.circle
            cx="104"
            cy="104"
            r={R}
            fill="none"
            stroke={fill}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? C - (score / 100) * C : C }}
            animate={{ strokeDashoffset: C - (score / 100) * C }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums text-ink">{display}</span>
          <span className="font-sans text-xs font-medium uppercase tracking-[0.16em] text-ink-faint">
            de 100
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
        {SEVERITY_LEVELS.map((l) => {
          const active = l.key === level.key;
          return (
            <span
              key={l.key}
              className={
                "pill border text-xs transition " +
                (active
                  ? "border-transparent text-ink"
                  : "border-natural bg-transparent text-ink-faint")
              }
              style={active ? { backgroundColor: LEVEL_FILL[l.key] } : undefined}
            >
              {l.range[0]}–{l.range[1]} {l.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
