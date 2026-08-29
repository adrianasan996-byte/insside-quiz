import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../data/questions";
import {
  computeScores,
  levelForScore,
  partialDominant,
  SEVERITY_LEVELS,
} from "./scoring";
import type { Answers, AnxietyType, LikertValue } from "../types";

function answersAll(value: LikertValue): Answers {
  return QUESTIONS.reduce((acc, q) => {
    acc[q.id] = value;
    return acc;
  }, {} as Answers);
}

/** Responde `high` a un tipo y `low` al resto. */
function answersFor(type: AnxietyType, high: LikertValue, low: LikertValue): Answers {
  return QUESTIONS.reduce((acc, q) => {
    acc[q.id] = q.type === type ? high : low;
    return acc;
  }, {} as Answers);
}

describe("levelForScore", () => {
  it("mapea los límites de cada rango", () => {
    expect(levelForScore(0).key).toBe("calma");
    expect(levelForScore(24).key).toBe("calma");
    expect(levelForScore(25).key).toBe("alerta");
    expect(levelForScore(49).key).toBe("alerta");
    expect(levelForScore(50).key).toBe("sobrecarga");
    expect(levelForScore(74).key).toBe("sobrecarga");
    expect(levelForScore(75).key).toBe("alarma");
    expect(levelForScore(100).key).toBe("alarma");
  });

  it("cubre 0-100 sin huecos", () => {
    for (let s = 0; s <= 100; s++) {
      expect(SEVERITY_LEVELS.some((l) => s >= l.range[0] && s <= l.range[1])).toBe(true);
    }
  });
});

describe("computeScores", () => {
  it("todo en 0 => calma, sin flag de apoyo", () => {
    const r = computeScores(answersAll(0));
    expect(r.total).toBe(0);
    expect(r.level.key).toBe("calma");
    expect(r.showSupport).toBe(false);
  });

  it("todo en el máximo => 100, alarma y flag de apoyo", () => {
    const r = computeScores(answersAll(3));
    expect(r.total).toBe(100);
    expect(r.level.key).toBe("alarma");
    expect(r.showSupport).toBe(true);
  });

  it("respuestas altas concentradas en un tipo => ese tipo es el primario", () => {
    for (const type of ["rumia", "control", "social", "rendimiento", "somatica"] as AnxietyType[]) {
      const r = computeScores(answersFor(type, 3, 0));
      expect(r.primary).toBe(type);
      expect(r.subscales[type]).toBe(100);
    }
  });

  it("marca showSupport cuando un ítem de pánico va alto aunque la severidad sea media", () => {
    const base = answersAll(1);
    const panic = QUESTIONS.find((q) => q.panicFlag)!;
    base[panic.id] = 3;
    const r = computeScores(base);
    expect(r.level.key).not.toBe("alarma");
    expect(r.showSupport).toBe(true);
  });

  it("ranked está ordenado de mayor a menor", () => {
    const r = computeScores(answersFor("social", 3, 1));
    const pcts = r.ranked.map((t) => r.subscales[t]);
    expect(pcts).toEqual([...pcts].sort((a, b) => b - a));
  });
});

describe("partialDominant", () => {
  it("detecta el tipo dominante con datos parciales (solo secciones 1-3)", () => {
    const partial: Answers = {};
    for (const q of QUESTIONS.filter((q) => q.section <= 2)) {
      partial[q.id] = q.type === "social" ? 3 : 1;
    }
    expect(partialDominant(partial)).toBe("social");
  });

  it("sin respuestas devuelve un fallback válido", () => {
    expect(partialDominant({})).toBe("rumia");
  });
});
