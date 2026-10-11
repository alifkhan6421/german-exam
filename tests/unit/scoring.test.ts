import { describe, expect, it } from "vitest";
import { getBlueprint } from "@/domain/blueprints";
import { allItems, ExamContentSchema, type AnswerValue } from "@/domain/exam/schema";
import { isCorrect, normaliseText, scoreAttempt } from "@/domain/scoring/score";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";

const content = ExamContentSchema.parse(goetheA1Mock1);
const bp = getBlueprint("goethe-a1-sd1")!;

function answers(correct: boolean) {
  const out: Record<string, AnswerValue> = {};
  for (const { item } of allItems(content)) {
    const key = content.answerKey[item.id]?.correct ?? [];
    if (item.type === "writing") out[item.id] = { kind: "text", text: "Liebe Frau Weber, ich komme am Montag. Viele Grüße" };
    else if (item.type === "speaking") out[item.id] = { kind: "recording", mediaId: `m-${item.id}`, durationSec: 40 };
    else if (item.type === "short_text") out[item.id] = { kind: "text", text: correct ? key[0] : "falsch" };
    else {
      const opts = item.options ?? allItems(content).find((x) => x.item.id === item.id)!.part.optionPool ?? [];
      out[item.id] = { kind: "choice", optionId: correct ? key[0] : opts.find((o) => !key.includes(o.id))!.id };
    }
  }
  return out;
}

const rubricItems = allItems(content).filter(({ item }) => item.type === "writing" || item.type === "speaking").map(({ item }) => item.id);
const human = (fraction: number) => rubricItems.map((itemId) => ({ itemId, source: "human" as const, total: 20 * fraction, max: 20 }));

describe("scoring", () => {
  it("normalises umlauts and punctuation for short answers", () => {
    expect(normaliseText("  Köln, Straße! ")).toBe("koeln strasse");
    const item = allItems(content).find((x) => x.item.type === "short_text")!.item;
    expect(isCorrect(item, { kind: "text", text: content.answerKey[item.id].correct[0].toUpperCase() }, content.answerKey[item.id].correct)).toBe(true);
  });

  it("keeps rubric sections pending and shows no total or pass estimate until assessed", () => {
    const r = scoreAttempt({ content, blueprint: bp, answers: answers(true), assessments: [] });
    expect(r.total).toBeNull();
    expect(r.pass.estimate).toBeNull();
    expect(r.sections.find((s) => s.sectionId === "hoeren")!.scaledPoints).toBeCloseTo(24.9, 1);
    expect(r.sections.find((s) => s.sectionId === "schreiben")!.rubric.status).toBe("pending");
  });

  it("estimates pass/fail once every section is scored, using the verified 60-point rule", () => {
    const pass = scoreAttempt({ content, blueprint: bp, answers: answers(true), assessments: human(1) });
    expect(pass.total!.max).toBe(100);
    expect(pass.total!.points).toBeGreaterThanOrEqual(95);
    expect(pass.pass.estimate).toBe(true);
    const fail = scoreAttempt({ content, blueprint: bp, answers: answers(false), assessments: human(0.2) });
    expect(fail.pass.estimate).toBe(false);
  });

  it("lets a human assessment override an AI assessment and marks AI-only results provisional", () => {
    const ai = rubricItems.map((itemId) => ({ itemId, source: "ai" as const, total: 4, max: 20 }));
    const aiOnly = scoreAttempt({ content, blueprint: bp, answers: answers(true), assessments: ai });
    expect(aiOnly.sections.find((s) => s.sectionId === "sprechen")!.provisional).toBe(true);
    const both = scoreAttempt({ content, blueprint: bp, answers: answers(true), assessments: [...human(1), ...ai] });
    const sprechen = both.sections.find((s) => s.sectionId === "sprechen")!;
    expect(sprechen.provisional).toBe(false);
    expect(sprechen.rubric.status).toBe("human_reviewed");
    expect(sprechen.scaledPoints).toBeCloseTo(sprechen.scaledMax!, 0); // 15 × 1.66 = 24.9; the total is rounded
  });

  it("gives no pass estimate when the blueprint's pass rule is not verified", () => {
    const telcA1 = getBlueprint("telc-a1-sd1")!;
    expect(telcA1.scoring.passRule.status).not.toBe("verified");
  });
});
