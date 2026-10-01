export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Dominios más usados por la audiencia; contra estos se buscan errores de tipeo. */
const DOMINIOS = [
  "gmail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "yahoo.com",
  "yahoo.es",
  "icloud.com",
  "live.com",
  "msn.com",
  "me.com",
  "aol.com",
  "protonmail.com",
];

/** Dominios reales que se parecen a los de arriba y no hay que "corregir". */
const REALES = [
  "mail.com",
  "gmx.com",
  "gmx.es",
  "ymail.com",
  "rocketmail.com",
  "live.es",
  "terra.com",
];

/** Terminaciones mal escritas muy comunes. */
const TLD_FIX: Record<string, string> = {
  con: "com",
  cmo: "com",
  ocm: "com",
  vom: "com",
  xom: "com",
  comm: "com",
  co: "com", // solo se aplica si el resto coincide con un dominio conocido
  om: "com",
  cm: "com",
  ese: "es",
};

function distancia(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      // transposición ("gmial" → "gmail")
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
}

/**
 * Si el dominio parece un error de tipeo de uno conocido, devuelve el correo
 * corregido ("ana@gmial.con" → "ana@gmail.com"); si no, null.
 */
export function sugerirEmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at < 1) return null;
  const usuario = e.slice(0, at);
  let dominio = e.slice(at + 1);
  if (!dominio || DOMINIOS.includes(dominio) || REALES.includes(dominio)) return null;

  // Falta el punto: "gmailcom"
  const sinPunto = DOMINIOS.find((d) => d.replace(".", "") === dominio);
  if (sinPunto) return `${usuario}@${sinPunto}`;

  const punto = dominio.lastIndexOf(".");
  if (punto > 0) {
    const tld = dominio.slice(punto + 1);
    if (TLD_FIX[tld]) dominio = `${dominio.slice(0, punto)}.${TLD_FIX[tld]}`;
  }

  let mejor: string | null = null;
  let mejorD = Infinity;
  for (const d of DOMINIOS) {
    // Casi nadie se equivoca en la primera letra ("gmial", "hotmial", "outlok").
    if (d[0] !== dominio[0]) continue;
    const dist = distancia(dominio, d);
    if (dist < mejorD) {
      mejor = d;
      mejorD = dist;
    }
  }
  // Hasta 2 cambios (o 1 en dominios cortos como me.com) para no "corregir" dominios reales.
  const tope = (mejor?.length ?? 0) <= 6 ? 1 : 2;
  const sugerido = mejor && mejorD <= tope ? `${usuario}@${mejor}` : null;
  return sugerido !== e ? sugerido : null;
}
