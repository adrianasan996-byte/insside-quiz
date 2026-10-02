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

## Integración con GoHighLevel

El quiz hace `POST /api/lead` **dos veces** por persona:

1. **`estado: "parcial"`** — apenas envía el formulario de contacto (tras la sección 1). Solo trae
   contacto + `tags: quiz-ansiedad,quiz-incompleto`. Así el lead existe aunque abandone el test.
2. **`estado: "completo"`** — al llegar al resultado. Trae todo el resultado y el tag
   `quiz-completado`.

GHL hace *upsert* por email/teléfono, así que ambos envíos caen en el mismo contacto. Esa función serverless (`api/lead.ts`) valida los datos y
los reenvía al **Inbound Webhook** de un workflow de GHL. La URL del webhook vive solo en el
servidor (nunca en el navegador ni en el repo).

**Configuración (una vez):**

1. Vercel → proyecto `insside-quiz` → *Settings → Environment Variables* → agrega
   `GHL_WEBHOOK_URL` = la URL del trigger *Inbound Webhook* (Production y Preview).
2. *Redeploy* para que la función la lea.
3. **Workflow:** justo después del trigger, un *If/Else* por `estado`:
   - `completo` → mapear campos, quitar tag `quiz-incompleto` y mandar el correo de resultados.
   - `parcial` → crear/actualizar contacto, *Wait* (p. ej. 2 h) y luego *If/Else*: si el contacto
     **no** tiene `quiz-completado` → seguimiento de "no terminó el test". **Sin este If/Else, el
     correo de resultados saldría vacío con el envío parcial.**
4. En GHL, crea las *Custom Fields* de abajo, manda una prueba (completa el quiz con tu email) →
   en el trigger del workflow, *Fetch Sample Requests* → mapea los campos.

**Campos que recibe el webhook (JSON plano):**

| Clave | Ejemplo | Mapear a en GHL |
| --- | --- | --- |
| `first_name` | `Ana María` (campo *Nombre* del form) | Contact → First Name |
| `last_name` | `Pérez López` (campo *Apellido* del form) | Contact → Last Name |
| `email` | `ana@ejemplo.com` | Contact → Email |
| `phone` | `+584121234567` (E.164, WhatsApp) | Contact → Phone |
| `source` | `test-ansiedad` | Contact → Source |
| `estado` | `parcial` · `completo` | Condición del workflow (If/Else) |
| `perfil` | `Patrón rumiante` | Custom Field (texto) · *Perfil de ansiedad* |
| `perfil_key` | `rumia` · `control` · `social` · `rendimiento` · `somatica` | Condición del workflow (If/Else) |
| `nivel` | `Sobre-alerta` | Custom Field (texto) · *Nivel de ansiedad* |
| `nivel_key` | `calma` · `alerta` · `sobrecarga` · `alarma` | Condición del workflow |
| `puntaje` | `40` (0–100) | Custom Field (número) · *Puntaje ansiedad* |
| `score_rumia` … `score_somatica` | `78` (0–100 cada uno) | Custom Fields (número), opcional |
| `requiere_apoyo` | `si` / `no` | Condición → tarea/alerta de seguimiento prioritario |
| `especialista_recomendado` | `Valentina Tello` | Custom Field (texto) · *Especialista sugerido* |
| `perfil_descripcion` | párrafo «Según tus respuestas…» del perfil | Custom Field (multilínea) · para el correo |
| `nivel_titulo` | `La ansiedad ya está pidiendo un poco más de atención` | Custom Field (texto) · para el correo |
| `nivel_mensaje` | párrafo de recomendación según el nivel | Custom Field (multilínea) · para el correo |
| `herramienta` | `Ventana de preocupación` | Custom Field (texto) · para el correo |
| `herramienta_como` | cómo aplicar esa herramienta | Custom Field (multilínea) · para el correo |
| `tags` | parcial: `quiz-ansiedad,quiz-incompleto` · completo: `quiz-ansiedad,quiz-completado,ansiedad-rumia,nivel-alerta` | Contact → Tags (Create/Update Contact) |
| `resumen` | texto multilínea | Acción *Add Note* |
| `fecha` | ISO 8601 | Opcional |

En el envío `parcial` solo van `first_name`, `last_name`, `email`, `phone`, `source`, `estado`,
`tags` y `fecha`. Las claves de contacto vacías (`first_name`, `email`, `phone`…) **no se envían**, para no borrar
datos que el contacto ya tenga en GHL. Para probar en local necesitas `vercel dev` (el `npm run dev`
de Vite no sirve `/api`).

## Estructura

```
src/
├── App.tsx                 # máquina de estados de pantallas
├── hooks/useQuizMachine.ts # pasos, respuestas, navegación, progreso
├── lib/
│   ├── scoring.ts          # computeScores() + partialDominant()
│   ├── phone.ts            # códigos de país + normalización de WhatsApp
│   └── storage.ts          # localStorage + envío a /api/lead
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
