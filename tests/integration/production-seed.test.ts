import { describe, expect, it } from "vitest";
import { createTestDb } from "@/server/db";
import { seed } from "@/server/db/seed";

describe("production seed", () => {
  it("creates reference data and an unpublished draft, never users or published exams", async () => {
    const db = await createTestDb({ devSeed: false });
    await seed(db, { dev: false }); // idempotent

    expect((await db.one<{ n: number }>(`select count(*)::int n from exams`))!.n).toBe(40);
    expect((await db.one<{ n: number }>(`select count(*)::int n from profiles`))!.n).toBe(0);
    expect((await db.one<{ n: number }>(`select count(*)::int n from exam_versions where status = 'published'`))!.n).toBe(0);
    expect((await db.one<{ n: number }>(`select count(*)::int n from blueprint_confirmations`))!.n).toBe(0);

    const v = await db.query<{ status: string; validation: { ok: boolean } }>(
      `select v.status, v.validation from exam_versions v join exams e on e.current_version_id = v.id where e.track_key = 'goethe-a1-sd1' and e.mock_number = 1`,
    );
    expect(v).toHaveLength(1);
    expect(v[0].status).toBe("draft");
    // Blocked until audio is produced and the blueprint is confirmed by an administrator.
    expect(v[0].validation.ok).toBe(false);
  });
});
