import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PAISES_DESTACADOS, buscarPaises, paisPorIso, type Pais } from "../lib/phone";

interface CountrySelectProps {
  value: string;
  onChange: (iso: string) => void;
  className?: string;
}

/** Selector de país con búsqueda (nombre sin tildes, código "+58" o ISO "VE"). */
export function CountrySelect({ value, onChange, className = "" }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const actual = paisPorIso(value);

  const opciones = useMemo<Pais[]>(() => {
    if (query.trim()) return buscarPaises(query);
    const destacados = new Set(PAISES_DESTACADOS.map((p) => p.iso));
    return [...PAISES_DESTACADOS, ...buscarPaises("").filter((p) => !destacados.has(p.iso))];
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    inputRef.current?.focus();
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function elegir(p: Pais) {
    onChange(p.iso);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, opciones.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (opciones[active]) elegir(opciones[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={`Código de país: ${actual.nombre} ${actual.code}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-full items-center gap-1.5 ${className}`}
      >
        <span aria-hidden>{actual.flag}</span>
        <span>{actual.code}</span>
        <svg aria-hidden viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-ink-faint">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-natural bg-white shadow-card">
          <div className="border-b border-natural p-2">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-controls={listId}
              aria-expanded
              aria-activedescendant={
                opciones[active] ? `${listId}-${opciones[active].iso}` : undefined
              }
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Buscar país o código"
              className="w-full rounded-xl bg-natural px-3 py-2 font-sans text-[14px] text-ink outline-none"
            />
          </div>
          <ul ref={listRef} id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {opciones.length === 0 ? (
              <li className="px-4 py-3 font-sans text-[13px] text-ink-faint">Sin resultados</li>
            ) : (
              opciones.map((p, i) => (
                <li
                  key={p.iso}
                  id={`${listId}-${p.iso}`}
                  role="option"
                  aria-selected={p.iso === value}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => elegir(p)}
                  className={
                    "flex cursor-pointer items-center gap-2.5 px-4 py-2 font-sans text-[14px] text-ink " +
                    (i === active ? "bg-salvia-wash" : "") +
                    (!query.trim() && i === PAISES_DESTACADOS.length - 1
                      ? " border-b border-natural"
                      : "")
                  }
                >
                  <span aria-hidden>{p.flag}</span>
                  <span className="flex-1 truncate">{p.nombre}</span>
                  <span className="text-ink-faint">{p.code}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
