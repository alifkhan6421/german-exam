import { handler } from "@/server/http";
import { advanceSection } from "@/server/services/attempts";

export const POST = handler<{ id: string }>(async ({ user, db, params }) => {
  const row = await advanceSection(db, user.id, params.id);
  return { status: row.state.status };
});
