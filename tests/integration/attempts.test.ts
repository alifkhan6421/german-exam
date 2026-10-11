import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, type Db } from "@/server/db";
import { loadProfile, type CurrentUser } from "@/server/auth/session";
import { setDbForTests } from "@/server/db";
import {
  advanceSection,
  getAttemptView,
  getReview,
  requestPlayback,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "@/server/services/attempts";
import { goetheA1Mock1 } from "@/content/goethe-a1/mock-1";

let db: Db;
let student: CurrentUser;
let examId: string;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
  const row = await db.one<{ id: string }>(`select id from profiles where email = 'student@example.com'`);
  student = (await loadProfile(row!.id))!;
  examId = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 1`))!.id;
});

const t0 = new Date("2026-10-11T10:00:00Z");
const at = (sec: number) => new Date(t0.getTime() + sec * 1000);

describe("exam attempt lifecycle", () => {
  it("starts with server-side deadlines and never sends the answer key", async () => {
    const { attemptId } = await startAttempt(db, student, { examId, mode: "exam" }, t0);
    const view = await getAttemptView(db, student.id, attemptId, at(1));
    expect(view.currentSectionIds).toEqual(["hoeren"]);
    expect(view.remainingMs).toBe(20 * 60 * 1000 - 1000);
    const json = JSON.stringify(view);
    expect(json).not.toContain("answerKey");
    expect(json).not.toContain("Die Eier sind bei der Milch"); // transcript text
  });

  it("resumes the same attempt after a refresh instead of starting a new one", async () => {
    const a = await startAttempt(db, student, { examId, mode: "exam" }, at(5));
    expect(a.resumed).toBe(true);
  });

  it("autosaves answers and rejects invalid options", async () => {
    const { attemptId } = await startAttempt(db, student, { examId, mode: "exam" }, at(10));
    await saveAnswer(db, student.id, attemptId, "h1", { kind: "choice", optionId: "b" }, at(20));
    await expect(saveAnswer(db, student.id, attemptId, "h1", { kind: "choice", optionId: "z" }, at(21))).rejects.toThrow("Invalid option");
    const view = await getAttemptView(db, student.id, attemptId, at(22));
    expect(view.answers.h1).toEqual({ kind: "choice", optionId: "b" });
  });

  it("enforces blueprint playback limits in exam mode (Teil 1 twice, Teil 2 once)", async () => {
    const { attemptId } = await startAttempt(db, student, { examId, mode: "exam" }, at(30));
    await requestPlayback(db, student.id, attemptId, "h-a1", at(31));
    await requestPlayback(db, student.id, attemptId, "h-a1", at(60));
    await expect(requestPlayback(db, student.id, attemptId, "h-a1", at(90))).rejects.toThrow(/played 2 times/);
    await requestPlayback(db, student.id, attemptId, "h-a7", at(91));
    await expect(requestPlayback(db, student.id, attemptId, "h-a7", at(120))).rejects.toThrow(/played once/);
  });

  it("closes a section when time runs out and blocks late answers", async () => {
    const { attemptId } = await startAttempt(db, student, { examId, mode: "exam" }, at(130));
    // 20 minutes + 30 seconds later: Hören has expired, Lesen is open.
    const view = await getAttemptView(db, student.id, attemptId, at(130 + 20 * 60 + 30));
    expect(view.currentSectionIds).toEqual(["lesen"]);
    await expect(saveAnswer(db, student.id, attemptId, "h2", { kind: "choice", optionId: "b" }, at(130 + 20 * 60 + 31))).rejects.toThrow(/closed/);
    await saveAnswer(db, student.id, attemptId, "l1", { kind: "choice", optionId: "r" }, at(130 + 20 * 60 + 40));
  });

  it("scores objective answers deterministically and keeps writing/speaking pending", async () => {
    // Fresh user-less path: use a practice attempt so the earlier exam attempt doesn't interfere.
    const { attemptId } = await startAttempt(db, student, { examId, mode: "practice", sectionIds: ["lesen", "schreiben"] }, at(5000));
    const key = goetheA1Mock1.answerKey;
    for (const id of ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12"]) {
      await saveAnswer(db, student.id, attemptId, id, { kind: "choice", optionId: key[id].correct![0] }, at(5010));
    }
    await saveAnswer(db, student.id, attemptId, "l13", { kind: "choice", optionId: "f" }, at(5011)); // wrong
    await saveAnswer(db, student.id, attemptId, "l14", { kind: "choice", optionId: "r" }, at(5012)); // wrong
    await advanceSection(db, student.id, attemptId, at(5100));
    await saveAnswer(db, student.id, attemptId, "s1", { kind: "text", text: " italien " }, at(5110));
    await saveAnswer(db, student.id, attemptId, "s2", { kind: "text", text: "50823, Koeln" }, at(5111));
    await saveAnswer(db, student.id, attemptId, "s3", { kind: "text", text: "28 Jahre" }, at(5112));
    await saveAnswer(db, student.id, attemptId, "s4", { kind: "text", text: "Pilates" }, at(5113)); // wrong
    await saveAnswer(db, student.id, attemptId, "s6", { kind: "text", text: "Liebes Team, ich kann am Freitag leider nicht kommen. Ich bin krank. Haben Sie nächste Woche einen Termin? Viele Grüße" }, at(5114));
    const done = await submitAttempt(db, student.id, attemptId, at(5200));
    const lesen = done.result!.sections.find((s) => s.sectionId === "lesen")!;
    expect(lesen.objective).toMatchObject({ correct: 12, incorrect: 2, unanswered: 1, points: 12, max: 15 });
    expect(lesen.scaledPoints).toBe(19.92);
    const schreiben = done.result!.sections.find((s) => s.sectionId === "schreiben")!;
    expect(schreiben.objective.points).toBe(3);
    expect(schreiben.rubric.status).toBe("pending");
    expect(schreiben.complete).toBe(false);
    expect(done.result!.pass.estimate).toBeNull();

    const review = await getReview(db, student, attemptId);
    expect(review.answerKey.l1.correct).toEqual(["r"]);
    expect(review.explanationsLocked).toBe(true); // free plan
  });
});
