import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { loadProfile, type CurrentUser } from "@/server/auth/session";
import { saveAnswer, startAttempt, submitAttempt, type AttemptRow } from "@/server/services/attempts";
import { requestAiAssessment, rubricFor, storeAiAssessment, submitHumanAssessment } from "@/server/services/assessment";
import { getBlueprint } from "@/domain/blueprints";

let db: Db;
let student: CurrentUser;
let examiner: CurrentUser;
let attemptId: string;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
  const load = async (email: string) => (await loadProfile((await db.one<{ id: string }>(`select id from profiles where email = $1`, [email]))!.id))!;
  student = await load("student@example.com");
  examiner = await load("examiner@example.com");
  const examId = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 1`))!.id;
  ({ attemptId } = await startAttempt(db, student, { examId, mode: "practice", sectionIds: ["schreiben"] }));
  await saveAnswer(db, student.id, attemptId, "s6", { kind: "text", text: "Liebe Frau Klein, ich kann am Freitag nicht kommen. Ich bin krank. Haben Sie am Montag Zeit? Viele Grüße, Elena" });
  await submitAttempt(db, student.id, attemptId);
});

describe("writing assessment", () => {
  it("requires AI processing consent and a configured model", async () => {
    await expect(requestAiAssessment(db, student, attemptId, "s6")).rejects.toThrow(/consent/);
    await expect(requestAiAssessment(db, { ...student, aiConsent: true }, attemptId, "s6")).rejects.toThrow(/not configured/);
  });

  it("stores AI output as provisional, clamped to the rubric", async () => {
    const row = (await db.one<AttemptRow>(`select * from attempts where id = $1`, [attemptId]))!;
    const rubric = rubricFor(getBlueprint("goethe-a1-sd1")!, "schreiben", "schreiben-2", "writing");
    const res = await storeAiAssessment(db, {
      row, itemId: "s6", kind: "writing", rubric, evaluator: "test-model", response: "Liebe Frau Klein",
      output: {
        criteria: rubric.criteria.map((c, i) => ({ id: c.id, points: i === 0 ? 99 : 3, comment: "ok" })),
        summary: "Good.", strengths: [], improvements: [], annotations: [{ excerpt: "not in text", issue: "x", suggestion: "y" }], improvedVersion: "…", taskPointsCovered: [],
      },
    });
    expect(res.total).toBeLessThanOrEqual(res.max);
    const stored = await db.one<{ feedback: { annotations: unknown[] } }>(`select feedback from assessments where id = $1`, [res.id]);
    expect(stored!.feedback.annotations).toHaveLength(0); // hallucinated excerpts are dropped
    const result = await db.one<{ result: { sections: { sectionId: string; provisional: boolean }[] } }>(`select result from attempts where id = $1`, [attemptId]);
    expect(result!.result.sections.find((s) => s.sectionId === "schreiben")!.provisional).toBe(true);
  });

  it("lets an examiner override the AI score, but not a student", async () => {
    const rubric = rubricFor(getBlueprint("goethe-a1-sd1")!, "schreiben", "schreiben-2", "writing");
    const scores = Object.fromEntries(rubric.criteria.map((c) => [c.id, c.max]));
    await expect(submitHumanAssessment(db, student, { attemptId, itemId: "s6", scores, comments: {}, summary: "" })).rejects.toThrow(/Forbidden/);
    await expect(submitHumanAssessment(db, examiner, { attemptId, itemId: "s6", scores: { ...scores, [rubric.criteria[0].id]: 9 }, comments: {}, summary: "" })).rejects.toThrow(/between 0/);
    await submitHumanAssessment(db, examiner, { attemptId, itemId: "s6", scores, comments: {}, summary: "Well done." });
    const result = await db.one<{ result: { sections: { sectionId: string; provisional: boolean; rubric: { status: string; points: number; max: number } }[] } }>(`select result from attempts where id = $1`, [attemptId]);
    const s = result!.result.sections.find((x) => x.sectionId === "schreiben")!;
    expect(s.provisional).toBe(false);
    expect(s.rubric.status).toBe("human_reviewed");
    expect(s.rubric.points).toBe(s.rubric.max);
  });
});
