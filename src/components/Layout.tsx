import type { ReactNode } from "react";
import { Wordmark } from "./Wordmark";

interface LayoutProps {
  children: ReactNode;
  /** Barra de progreso a mostrar en el header (opcional). */
  header?: ReactNode;
  /** Alineación vertical del contenido principal. */
  align?: "center" | "top";
}

export function Layout({ children, header, align = "center" }: LayoutProps) {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden">
      {/* Halos de fondo, estáticos y sutiles */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-40 h-[26rem] w-[26rem] rounded-full bg-salvia/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-[24rem] w-[24rem] rounded-full bg-calma/50 blur-[100px]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-quiz flex-col px-5 pb-16 pt-6 sm:px-6">
        <header className="flex items-center justify-between gap-4">
          <Wordmark />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Test de ansiedad
          </span>
        </header>

        {header ? <div className="mt-5">{header}</div> : null}

        <main
          className={
            "flex flex-1 flex-col py-8 " +
            (align === "center" ? "justify-center" : "justify-start")
          }
        >
          {children}
        </main>

        <footer className="mt-auto pt-6 text-center font-sans text-xs text-ink-faint">
          Hecho por{" "}
          <a className="link-underline" href="https://www.insside.co" target="_blank" rel="noreferrer">
            Insside
          </a>{" "}
          · Especialistas en salud mental, en español
        </footer>
      </div>
    </div>
  );
}
