import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { loadProfile } from "@/server/auth/session";
import { importAudioBundle, listAudioBundles } from "@/server/services/audio-bundle";

let db: Db;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
});

describe("prepared audio bundle", () => {
  it("covers every Mock 1 listening script", async () => {
    const bundle = (await listAudioBundles()).find((b) => b.trackKey === "goethe-a1-sd1" && b.mockNumber === 1);
    expect(bundle).toBeTruthy();
    const v = (await db.one<{ content: { scripts: { id: string }[] } }>(
      `select v.content from exam_versions v join exams e on e.current_version_id = v.id where e.track_key = 'goethe-a1-sd1' and e.mock_number = 1`,
    ))!;
    expect(bundle!.entries.map((e) => e.scriptId).sort()).toEqual(v.content.scripts.map((s) => s.id).sort());
  });

  it("imports unapproved final assets once", async () => {
    const editor = (await loadProfile((await db.one<{ id: string }>(`select id from profiles where email = 'editor@example.com'`))!.id))!;
    const [bundle] = await listAudioBundles();
    const first = await importAudioBundle(db, editor, bundle.dir);
    expect(first.imported).toBe(bundle.entries.length);
    const statuses = await db.query<{ status: string }>(`select status from audio_assets where production->>'bundle' = $1`, [bundle.dir]);
    expect(statuses.every((r) => r.status === "generated")).toBe(true);

    const again = await importAudioBundle(db, editor, bundle.dir);
    expect(again).toEqual({ imported: 0, skipped: bundle.entries.length });
  });
});
