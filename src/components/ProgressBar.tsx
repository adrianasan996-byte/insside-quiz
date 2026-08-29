import { SECTIONS } from "../data/questions";

interface ProgressBarProps {
  activeSectionIndex: number;
  /** 0..1 sobre el total de preguntas. */
  progress: number;
}

export function ProgressBar({ activeSectionIndex, progress }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        {SECTIONS.map((s, i) => {
          const state =
            i < activeSectionIndex ? "done" : i === activeSectionIndex ? "active" : "todo";
          return (
            <div key={s.key} className="flex-1">
              <div
                className={
                  "h-1.5 rounded-full transition-colors duration-500 " +
                  (state === "done"
                    ? "bg-salvia-deep"
                    : state === "active"
                      ? "bg-salvia"
                      : "bg-natural-deep")
                }
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        <span>
          Sección {Math.min(activeSectionIndex + 1, SECTIONS.length)} de {SECTIONS.length}
          {" · "}
          {SECTIONS[Math.min(activeSectionIndex, SECTIONS.length - 1)].title}
        </span>
        <span aria-hidden>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}
