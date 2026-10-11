import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { loadProfile, type CurrentUser } from "@/server/auth/session";
import { createDraftVersion, duplicateExam, getExam, publishVersion, reviewVersion, saveDraftContent, submitForReview, validateVersion } from "@/server/services/exams";
import { getAttemptView, startAttempt } from "@/server/services/attempts";

let db: Db;
let editor: CurrentUser;
let examiner: CurrentUser;
let student: CurrentUser;
let examId: string;

const user = async (email: string) => (await loadProfile((await db.one<{ id: string }>(`select id from profiles where email = $1`, [email]))!.id))!;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
  editor = await user("editor@example.com");
  examiner = await user("examiner@example.com");
  student = await user("student@example.com");
  examId = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 1`))!.id;
});

describe("publication workflow and versioning", () => {
  it("publishes a new version while existing attempts keep the version they started with", async () => {
    const before = (await getExam(db, examId))!;
    const { attemptId } = await startAttempt(db, student, { examId, mode: "exam" });

    const v2 = await createDraftVersion(db, { examId, actorId: editor.id });
    const content = v2.content as { title: string; sections: { sectionId: string; parts: { instructionsDe: string }[] }[] };
    content.sections[1].parts[0].instructionsDe = "Lesen Sie die zwei Texte. Sind die Aussagen richtig oder falsch? (überarbeitet)";
    await saveDraftContent(db, { versionId: v2.id, actorId: editor.id, content });
    await submitForReview(db, { versionId: v2.id, actorId: editor.id });

    // Locked once in review.
    await expect(saveDraftContent(db, { versionId: v2.id, actorId: editor.id, content })).rejects.toThrow(/locked/);
    // Cannot publish before approval.
    await expect(publishVersion(db, { versionId: v2.id, actorId: editor.id })).rejects.toThrow(/approved/);

    await reviewVersion(db, { versionId: v2.id, actorId: examiner.id, decision: "approve" });
    await publishVersion(db, { versionId: v2.id, actorId: editor.id });

    const after = (await getExam(db, examId))!;
    expect(after.published_version_id).toBe(v2.id);
    const old = await db.one<{ status: string }>(`select status from exam_versions where id = $1`, [before.published_version_id]);
    expect(old!.status).toBe("superseded");

    const attempt = await db.one<{ exam_version_id: string }>(`select exam_version_id from attempts where id = $1`, [attemptId]);
    expect(attempt!.exam_version_id).toBe(before.published_version_id);
    const view = await getAttemptView(db, student.id, attemptId);
    expect(view.content.sections.find((s) => s.sectionId === "lesen")?.parts[0].instructionsDe ?? "").not.toContain("überarbeitet");
  });

  it("returns a version to draft when the reviewer requests changes", async () => {
    const v = await createDraftVersion(db, { examId, actorId: editor.id });
    await submitForReview(db, { versionId: v.id, actorId: editor.id });
    await reviewVersion(db, { versionId: v.id, actorId: examiner.id, decision: "request_changes", comments: "Item 3 is ambiguous." });
    const row = await db.one<{ status: string; locked: boolean }>(`select status, locked from exam_versions where id = $1`, [v.id]);
    expect(row).toEqual({ status: "draft", locked: false });
    expect((await getExam(db, examId))!.status).toBe("published"); // live version unaffected
  });

  it("blocks a copied mock exam through the similarity check", async () => {
    const mock2 = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 2`))!.id;
    const v = await duplicateExam(db, { fromExamId: examId, toExamId: mock2, actorId: editor.id });
    const report = await validateVersion(db, { versionId: v.id, actorId: editor.id });
    expect(report.ok).toBe(false);
    expect(report.issues.some((i) => i.code.includes("similar"))).toBe(true);
    await expect(submitForReview(db, { versionId: v.id, actorId: editor.id })).rejects.toThrow(/critical/);
  });

  it("does not let exams on an unconfirmed blueprint pass validation", async () => {
    const a2 = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a2' and mock_number = 1`))!.id;
    const v = await createDraftVersion(db, { examId: a2, actorId: editor.id });
    const report = await validateVersion(db, { versionId: v.id, actorId: editor.id });
    expect(report.ok).toBe(false);
    expect(report.issues.find((i) => i.code === "blueprint_unconfirmed")?.severity).toBe("critical");
  });
});
