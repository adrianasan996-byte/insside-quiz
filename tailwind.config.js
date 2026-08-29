/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Sistema de marca Insside (tomado de insside.co / globals.css) ──
        paper: "#FDFBF8", // --background
        ink: {
          DEFAULT: "#262525", // --foreground / --negro-neutro
          soft: "rgba(38,37,37,0.66)",
          faint: "rgba(38,37,37,0.44)",
        },
        natural: "#EDE7E1", // --natural (tarjetas / bordes)
        "natural-deep": "#E2DAD0",
        salvia: {
          DEFAULT: "#B5BC8F", // --salvia
          deep: "#8B9970", // --te-verde
          wash: "#EAECDD",
        },
        calma: "#D9E5DB", // --calma (menta)
        balance: "#64C1C4", // --balance (teal)
        energia: "#E3812F", // --energia (naranja)
        terracota: "#AB6139", // --terracota
        // ── Colores por nivel de severidad (círculo de score) ──
        "lvl-calma": "#C4D0A6",
        "lvl-alerta": "#E8D6A2",
        "lvl-sobrecarga": "#E9B583",
        "lvl-alarma": "#D98E77",
        // ── Colores por tipo de ansiedad (dentro de la paleta de marca) ──
        "type-rumia": "#8B9970", // té verde
        "type-control": "#64C1C4", // balance / teal
        "type-social": "#E3812F", // energía
        "type-rendimiento": "#C2A24A", // mostaza cálida
        "type-somatica": "#AB6139", // terracota
      },
      fontFamily: {
        // Montserrat en todo, igual que el sitio
        sans: [
          '"Montserrat"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      maxWidth: {
        quiz: "42rem",
        readable: "38rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(38,37,37,0.04), 0 14px 44px -14px rgba(38,37,37,0.14)",
        pill: "0 1px 2px rgba(38,37,37,0.06)",
      },
    },
  },
  plugins: [],
};
