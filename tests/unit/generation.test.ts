import { describe, expect, it } from "vitest";
import { getBlueprint } from "@/domain/blueprints";
import { ExamContentSchema } from "@/domain/exam/schema";
import { validateExam } from "@/domain/exam/validate";
import { mergeGenerated } from "@/domain/generation/merge";
import { buildGenerationPrompt } from "@/domain/generation/prompt";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";

const base = ExamContentSchema.parse(goetheA1Mock1);
const bp = getBlueprint("goethe-a1-sd1")!;

describe("AI generation merge and validation", () => {
  it("replaces a single item and its answer key, keeping id and number", () => {
    const part = base.sections.find((s) => s.sectionId === "lesen")!.parts[0];
    const old = part.items[0];
    const out = mergeGenerated(base, "item", { sectionId: "lesen", partId: part.partId, itemId: old.id }, {
      item: { ...old, id: "new-id", number: 99, prompt: "Frau Berg kommt am Dienstag." },
      stimuli: [],
      scripts: [],
      answerKey: { "new-id": { correct: [old.options![1].id], explanation: "Because.", evidence: "Dienstag" } },
    });
    const merged = out.sections.find((s) => s.sectionId === "lesen")!.parts[0].items[0];
    expect(merged.id).toBe(old.id);
    expect(merged.number).toBe(old.number);
    expect(merged.prompt).toBe("Frau Berg kommt am Dienstag.");
    expect(out.answerKey[old.id].correct).toEqual([old.options![1].id]);
    expect(base.sections.find((s) => s.sectionId === "lesen")!.parts[0].items[0].prompt).not.toBe(merged.prompt); // input untouched
  });

  it("rejects output that does not match the scope schema", () => {
    expect(() => mergeGenerated(base, "part", { sectionId: "lesen", partId: "lesen-1" }, { part: { partId: "lesen-1" } })).toThrow(/does not match/);
    expect(() => mergeGenerated(base, "part", { sectionId: "nope", partId: "x" }, { part: base.sections[1].parts[0] })).toThrow(/Unknown section/);
  });

  it("flags a generated part that breaks the blueprint as critical", () => {
    const part = structuredClone(base.sections.find((s) => s.sectionId === "lesen")!.parts[0]);
    part.items = part.items.slice(0, 2); // blueprint requires 5
    const out = mergeGenerated(base, "part", { sectionId: "lesen", partId: part.partId }, { part, scripts: [], answerKey: {} });
    const report = validateExam(out, bp, { blueprintConfirmed: true, allowDevPreviewAudio: true });
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.severity === "critical")).toBe(true);
  });

  it("builds a prompt that carries the blueprint, originality rules and the brief", () => {
    const p = buildGenerationPrompt({ blueprint: bp, scope: "part", target: { sectionId: "lesen", partId: "lesen-2" }, base, brief: "Theme: sports club", formatExample: {}, avoidThemes: ["Einkaufen"] });
    expect(p.system).toMatch(/newly invented/);
    expect(p.user).toContain("lesen-2");
    expect(p.user).toContain("Theme: sports club");
    expect(p.user).toContain("Einkaufen");
  });
});
