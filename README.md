# Insside · Test de ansiedad

**¿Qué tipo de ansiedad controla tu vida?** — cuestionario interactivo de captación para
[Insside](https://www.insside.co).

El usuario responde 20 preguntas repartidas en 5 secciones, con dos pantallas informativas
dinámicas por el camino. Al final obtiene un **puntaje de severidad (0–100)**, su **patrón de
ansiedad dominante** (de 5 posibles), un **mini-diagnóstico**, **3 herramientas** con respaldo en
TCC/ACT y la **recomendación de un especialista de Insside** con CTA a WhatsApp.

Inspirado en el formato del [anxiety test de Grow Therapy](https://growtherapy.com/mental-health-tests/anxiety-test/):
estética editorial, escala tipo GAD-7, contenido de lectura debajo del resultado.

---

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (tema en `tailwind.config.js`)
- **Framer Motion** (transiciones)
- **Vitest** (tests de la lógica de puntaje)

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:5173
```

| Comando             | Qué hace                                         |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                          |
| `npm run build`     | Typecheck + build de producción a `dist/`       |
| `npm run preview`   | Sirve el build de `dist/`                       |
| `npm test`          | Corre los tests de `src/lib/scoring.test.ts`    |
| `npm run typecheck` | Solo chequeo de tipos                           |

## Despliegue

Cualquier hosting de estáticos. Incluye `vercel.json` con el rewrite de SPA, así que en
**Vercel** basta con importar el repo (framework: Vite, sin más configuración).

---

## Cómo editar el contenido

Todo el texto vive en `src/data/` — no hace falta tocar componentes:

| Archivo                     | Contenido                                                                 |
| --------------------------- | ------------------------------------------------------------------------- |
| `src/data/questions.ts`     | Las 20 preguntas, las 5 secciones y la escala Likert                      |
| `src/data/interstitials.ts` | Las 2 pantallas informativas (una variante por patrón dominante)          |
| `src/data/results.ts`       | Mini-diagnóstico, herramientas, copy por nivel, secciones de lectura, fuentes |
| `src/data/specialists.ts`   | Especialistas, qué patrón mapea a quién, y el mensaje pre-llenado de WhatsApp |

### Añadir o cambiar una pregunta

En `src/data/questions.ts`, agrega un objeto a `QUESTIONS`:

```ts
{
  id: "m5",                 // único
  section: 0,               // índice 0-based en SECTIONS
  type: "rumia",            // subescala, o null si solo suma a la severidad global
  text: "…",
  weight: 1,                // opcional, peso en la severidad global
  panicFlag: true,          // opcional, activa la caja de apoyo si va alto
}
```

El puntaje se normaliza sobre las preguntas respondidas, así que no hace falta que todas las
subescalas tengan el mismo número de ítems.

### Modelo de puntaje

`src/lib/scoring.ts`:

- **Severidad global**: suma ponderada de todas las respuestas / máximo posible → 0–100 → nivel
  (`Calma vigilante` / `Sobre-alerta` / `Sobrecarga` / `Señal de alarma`).
- **Subescalas**: cada patrón se normaliza 0–100 sobre sus propios ítems. El mayor es el
  `primary`; el segundo, `secondary`.
- **`showSupport`**: `true` si el nivel es `Señal de alarma` o si un ítem con `panicFlag` va en
  "Más de la mitad de los días" o más. Muestra la caja de ayuda en crisis.
- El primer intersticial usa `partialDominant()` (solo las secciones respondidas hasta ese punto).

---

## Captura de leads

Al enviar el formulario final se guarda en `localStorage` (`insside_quiz_lead`,
`insside_quiz_result`) y, **si defines `VITE_LEAD_WEBHOOK`**, se hace un `POST` con el resultado.

```bash
cp .env.example .env
# VITE_LEAD_WEBHOOK=https://hooks.zapier.com/...  (o Make, Google Apps Script, Formspree, tu API)
```

Payload enviado:

```json
{
  "nombre": "…",
  "email": "…",
  "perfil": "Ansiedad rumiante",
  "nivel": "Sobre-alerta",
  "puntaje": 42,
  "subescalas": { "rumia": 78, "control": 55, "social": 25, "rendimiento": 30, "somatica": 40 },
  "fecha": "2026-08-27T21:00:00.000Z"
}
```

El `fetch` nunca bloquea ni rompe la UI: si el webhook falla, el dato igual queda en
`localStorage`. Ver `src/lib/storage.ts`.

---

## Estructura

```
src/
├── App.tsx                 # máquina de estados de pantallas
├── hooks/useQuizMachine.ts # pasos, respuestas, navegación, progreso
├── lib/
│   ├── scoring.ts          # computeScores() + partialDominant()
│   └── storage.ts          # localStorage + webhook opcional
├── data/                   # TODO el contenido editable
└── components/
    ├── Layout, ProgressBar, Wordmark
    ├── IntroScreen, SectionIntro, QuestionCard, Interstitial, LeadCapture
    └── ResultScreen ← ScoreDial, TypeBars, SpecialistCard
```

## Nota clínica

No es un instrumento diagnóstico. Es una herramienta de autoconocimiento basada en TCC y ACT e
inspirada en escalas como el GAD-7. El texto lo deja claro en la portada, en la captura y en el
resultado.
