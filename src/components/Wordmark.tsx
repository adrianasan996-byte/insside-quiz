export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.insside.co"
      target="_blank"
      rel="noreferrer"
      className={`inline-flex transition hover:opacity-70 ${className}`}
      aria-label="Insside — ir al sitio"
    >
      <img
        src="/brand/logos/wordmark-salvia.png"
        alt="Insside"
        className="h-8 w-auto sm:h-10"
        draggable={false}
      />
    </a>
  );
}
