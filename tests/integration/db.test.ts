import { describe, expect, it } from "vitest";
import { createTestDb } from "@/server/db";

describe("database bootstrap", () => {
  it("applies migrations and seeds tracks, plans, 40 exam slots and the demo exam", async () => {
    const db = await createTestDb();
    const tracks = await db.query<{ key: string }>(`select key from exam_tracks order by sort`);
    expect(tracks).toHaveLength(8);
    const exams = await db.query(`select id from exams`);
    expect(exams).toHaveLength(40);
    const published = await db.query<{ status: string }>(`select status from exams where published_version_id is not null`);
    expect(published).toHaveLength(1);
    const plans = await db.query(`select id from plans`);
    expect(plans).toHaveLength(3);
    await db.close();
  });
});
