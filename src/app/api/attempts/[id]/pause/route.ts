import { handler, jsonBody } from "@/server/http";
import { setPaused } from "@/server/services/attempts";

export const POST = handler<{ id: string }>(async ({ user, db, req, params }) => {
  const body = await jsonBody<{ paused: boolean }>(req);
  await setPaused(db, user.id, params.id, !!body.paused);
});
