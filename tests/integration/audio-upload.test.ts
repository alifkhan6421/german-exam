import { beforeAll, describe, expect, it } from "vitest";
import { createTestDb, setDbForTests, type Db } from "@/server/db";
import { loadProfile } from "@/server/auth/session";
import { prepareFinalUpload, uploadFinal } from "@/server/services/audio";

let db: Db;

beforeAll(async () => {
  db = await createTestDb();
  setDbForTests(db);
});

describe("final audio upload", () => {
  it("uses the server upload path with development storage and records an unapproved asset", async () => {
    const admin = (await loadProfile((await db.one<{ id: string }>(`select id from profiles where email = 'editor@example.com'`))!.id))!;
    const v = (await db.one<{ id: string; content: { scripts: { id: string }[] } }>(
      `select v.id, v.content from exam_versions v join exams e on e.current_version_id = v.id where e.track_key = 'goethe-a1-sd1' and e.mock_number = 1`,
    ))!;
    const scriptId = v.content.scripts[0].id;
    expect(await prepareFinalUpload(db, { versionId: v.id, scriptId, mime: "audio/wav", bytes: 1000 })).toBeNull();

    const id = await uploadFinal(db, admin, {
      versionId: v.id, scriptId, data: Buffer.alloc(1000), mime: "audio/wav", durationSec: 3, production: {}, provider: "upload",
    });
    const asset = await db.one<{ status: string; kind: string }>(`select status, kind from audio_assets where id = $1`, [id]);
    expect(asset).toMatchObject({ kind: "final" });
    expect(asset!.status).not.toBe("approved");

    await expect(uploadFinal(db, admin, { versionId: v.id, scriptId, data: Buffer.alloc(10), mime: "text/html", durationSec: 0, production: {}, provider: "upload" }))
      .rejects.toThrow(/Unsupported/);
  });
});
