import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { loadProfile } from "@/server/auth/session";
import { saveAnswer, startAttempt } from "@/server/services/attempts";
import { deleteAccount, exportUserData, purgeExpiredRecordings } from "@/server/services/privacy";

let db: Db;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
});

describe("GDPR", () => {
  it("exports a user's data and deletes the account with its attempts", async () => {
    await db.query(`insert into profiles (id, email, display_name, onboarded_at) values ('11111111-1111-4111-8111-111111111111', 'gdpr@example.com', 'G', now())`);
    const user = (await loadProfile("11111111-1111-4111-8111-111111111111"))!;
    const examId = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 1`))!.id;
    const { attemptId } = await startAttempt(db, user, { examId, mode: "exam" });
    await saveAnswer(db, user.id, attemptId, "h1", { kind: "choice", optionId: "a" });
    await db.query(`insert into payments (user_id, amount_cents, currency, status, source) values ($1, 100, 'eur', 'paid', 'dev_simulated')`, [user.id]);

    const data = await exportUserData(db, user.id);
    expect(data.profile).toMatchObject({ email: "gdpr@example.com" });
    expect(data.attempts).toHaveLength(1);
    expect(data.answers).toHaveLength(1);

    await deleteAccount(db, user);
    expect(await db.one(`select 1 from profiles where id = $1`, [user.id])).toBeUndefined();
    expect(await db.one(`select 1 from attempts where id = $1`, [attemptId])).toBeUndefined();
    const payment = await db.one<{ user_id: string | null }>(`select user_id from payments where amount_cents = 100`);
    expect(payment!.user_id).toBeNull(); // kept for accounting, unlinked
  });

  it("purges recordings past their retention date", async () => {
    const student = (await db.one<{ id: string }>(`select id from profiles where email = 'student@example.com'`))!.id;
    const examId = (await db.one<{ id: string }>(`select id from exams where track_key = 'goethe-a1-sd1' and mock_number = 1`))!.id;
    const u = (await loadProfile(student))!;
    const { attemptId } = await startAttempt(db, u, { examId, mode: "exam" });
    await db.query(`insert into submission_media (attempt_id, user_id, item_id, storage_path, mime, bytes, retention_until) values ($1, $2, 'p1', 'x/none.webm', 'audio/webm', 1, now() - interval '1 day')`, [attemptId, student]);
    expect((await purgeExpiredRecordings(db)).deleted).toBe(1);
  });
});
