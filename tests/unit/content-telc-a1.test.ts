/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";
import { telcA1 } from "@/domain/blueprints/telc";
import { ExamContentSchema, type ExamContentInput } from "@/domain/exam/schema";
import { validateExam } from "@/domain/exam/validate";

const mocks = import.meta.glob<Record<string, ExamContentInput>>("../../src/content/telc-a1/mock-*.ts", { eager: true });

describe.each(Object.entries(mocks))("telc A1 %s", (_file, mod) => {
  const content = Object.values(mod)[0];

  it("parses against the exam content schema", () => {
    expect(() => ExamContentSchema.parse(content)).not.toThrow();
  });

  it("targets the current telc A1 blueprint", () => {
    expect(content.blueprintKey).toBe(telcA1.key);
    expect(content.blueprintVersion).toBe(telcA1.version);
  });

  it("has no critical validation issues once the blueprint is confirmed (dev audio allowed)", () => {
    const report = validateExam(content, telcA1, { blueprintConfirmed: true, allowDevPreviewAudio: true });
    expect(report.issues.filter((i) => i.severity === "critical")).toEqual([]);
  });
});
