import { handler } from "@/server/http";
import { submitAttempt } from "@/server/services/attempts";

export const POST = handler<{ id: string }>(async ({ user, db, params }) => {
  const row = await submitAttempt(db, user.id, params.id);
  return { status: row.status };
});
