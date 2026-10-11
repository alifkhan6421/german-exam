import { describe, expect, it } from "vitest";
import { goetheA1 } from "@/domain/blueprints/goethe-a1";
import { ExamContentSchema } from "@/domain/exam/schema";
import { validateExam } from "@/domain/exam/validate";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";

describe("Goethe A1 Mock Test 1", () => {
  it("parses against the exam content schema", () => {
    expect(() => ExamContentSchema.parse(goetheA1Mock1)).not.toThrow();
  });

  it("has no critical validation issues once the blueprint is confirmed (dev audio allowed)", () => {
    const report = validateExam(goetheA1Mock1, goetheA1, { blueprintConfirmed: true, allowDevPreviewAudio: true });
    const critical = report.issues.filter((i) => i.severity === "critical");
    expect(critical).toEqual([]);
  });

  it("is blocked from publication without approved audio in production", () => {
    const report = validateExam(goetheA1Mock1, goetheA1, { blueprintConfirmed: true, allowDevPreviewAudio: false });
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code === "audio_not_approved" && i.severity === "critical")).toBe(true);
  });

  it("is blocked while the blueprint has unconfirmed facts", () => {
    const report = validateExam(goetheA1Mock1, goetheA1, { blueprintConfirmed: false, allowDevPreviewAudio: true });
    expect(report.issues.some((i) => i.code === "blueprint_unconfirmed")).toBe(true);
  });
});
