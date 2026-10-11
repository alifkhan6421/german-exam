import { handler } from "@/server/http";
import { getAttemptView } from "@/server/services/attempts";

export const GET = handler<{ id: string }>(async ({ user, db, params }) => getAttemptView(db, user.id, params.id));
