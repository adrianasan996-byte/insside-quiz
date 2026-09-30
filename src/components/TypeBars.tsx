import { motion } from "framer-motion";
import { RESULTS } from "../data/results";
import type { AnxietyType } from "../types";

interface TypeBarsProps {
  subscales: Record<AnxietyType, number>;
  ranked: AnxietyType[];
  primary: AnxietyType;
}

export const TYPE_COLOR: Record<string, string> = {
  "type-rumia": "#8B9970",
  "type-control": "#64C1C4",
  "type-social": "#E3812F",
  "type-rendimiento": "#C2A24A",
  "type-somatica": "#AB6139",
};

export function TypeBars({ subscales, ranked, primary }: TypeBarsProps) {
  return (
    <div className="space-y-3">
      {ranked.map((t, i) => {
        const r = RESULTS[t];
        const pct = subscales[t];
        const isPrimary = t === primary;
        return (
          <div key={t}>
            <div className="flex items-baseline justify-between font-sans">
              <span
                className={
                  "text-sm " + (isPrimary ? "font-semibold text-ink" : "text-ink-soft")
                }
              >
                {r.titulo}
                {isPrimary ? (
                  <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-salvia-deep">
                    dominante
                  </span>
                ) : null}
              </span>
              <span className="text-xs tabular-nums text-ink-faint">{pct}%</span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-natural-deep/70">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: TYPE_COLOR[r.colorKey] }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
