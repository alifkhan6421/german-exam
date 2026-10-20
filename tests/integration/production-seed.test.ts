import { describe, expect, it } from "vitest";
import { createTestDb } from "@/server/db";
import { seed } from "@/server/db/seed";
import { getBlueprint } from "@/domain/blueprints";
import { skeletonContent } from "@/server/services/exams";

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

    const telc = await db.query<{ mock_number: number; status: string; validation: { ok: boolean } }>(
      `select e.mock_number, v.status, v.validation from exam_versions v join exams e on e.current_version_id = v.id where e.track_key = 'telc-a1-sd1' order by e.mock_number`,
    );
    expect(telc.map((t) => t.mock_number)).toEqual([1, 2, 3, 4, 5]);
    expect(telc.every((t) => t.status === "draft" && !t.validation.ok)).toBe(true);
  });

  it("replaces an untouched editor skeleton with authored content but keeps real edits", async () => {
    const db = await createTestDb({ devSeed: false });
    const bp = getBlueprint("telc-a1-sd1")!;
    const exams = await db.query<{ id: string; mock_number: number }>(`select id, mock_number from exams where track_key = 'telc-a1-sd1' and mock_number in (1, 2) order by mock_number`);
    // Simulate an admin who opened the editor (skeleton) for mock 1 and wrote real text for mock 2.
    const edited = skeletonContent(bp, "Eigener Test");
    edited.sections[0].parts[0].items[0].prompt = "Wohin fährt der Bus?";
    for (const [e, content] of [[exams[0], skeletonContent(bp, "x")], [exams[1], edited]] as const) {
      const v = await db.one<{ id: string }>(
        `insert into exam_versions (exam_id, version, blueprint_key, blueprint_version, content, status, validation, locked)
         values ($1, 9, $2, $3, $4::jsonb, 'draft', '{}'::jsonb, false) returning id`,
        [e.id, bp.key, bp.version, JSON.stringify(content)],
      );
      await db.query(`update exams set current_version_id = $1 where id = $2`, [v!.id, e.id]);
    }
    await seed(db, { dev: false });
    const cur = await db.query<{ mock_number: number; version: number; title: string }>(
      `select e.mock_number, v.version, v.content->>'title' title from exams e join exam_versions v on v.id = e.current_version_id where e.track_key = 'telc-a1-sd1' and e.mock_number in (1, 2) order by 1`,
    );
    expect(cur[0]).toMatchObject({ version: 10, title: "telc A1 — Übungstest 1" });
    expect(cur[1]).toMatchObject({ version: 9, title: "Eigener Test" });
  });
});
