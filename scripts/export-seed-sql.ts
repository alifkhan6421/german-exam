/**
 * Writes the reference/demo seed as plain SQL, for applying through tools that can only run SQL
 * (e.g. the Supabase SQL editor). Runs the TypeScript seed against an in-memory database and dumps
 * the seeded tables as idempotent inserts.
 *
 *   npx tsx --conditions=react-server scripts/export-seed-sql.ts [--demo] > seed.sql
 */
import { createTestDb } from "../src/server/db";

const TABLES = ["blueprint_versions", "exam_tracks", "plans", "exams", "exam_versions", "blueprint_confirmations", "audit_log"];

async function main() {
  const demo = process.argv.includes("--demo");
  const db = await createTestDb({ devSeed: false, demo });
  const out = ["begin;", "set constraints all deferred;"];
  for (const t of TABLES) {
    const rows = await db.query(`select * from ${t}`);
    if (!rows.length) continue;
    const json = JSON.stringify(rows).replace(/'/g, "''");
    out.push(`insert into ${t} select * from jsonb_populate_recordset(null::${t}, '${json}'::jsonb) on conflict do nothing;`);
  }
  out.push("commit;");
  console.log(out.join("\n"));
  await db.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
