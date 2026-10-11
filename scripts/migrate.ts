/**
 * Production database setup: applies supabase/migrations and seeds reference data
 * (blueprints, tracks, plans, 40 exam slots, Goethe A1 Mock 1 as an unpublished draft).
 * Never creates development users or publishes anything.
 *
 *   DATABASE_URL=postgres://... npm run db:migrate
 */
import { createPg, migrate } from "../src/server/db";
import { seed } from "../src/server/db/seed";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const db = await createPg(url);
  try {
    await migrate(db, { includeDev: false });
    await seed(db, { dev: false });
    console.log("Migrations applied and reference data seeded.");
  } finally {
    await db.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
