import { handler, jsonBody } from "@/server/http";
import { requestPlayback } from "@/server/services/attempts";

export const POST = handler<{ id: string }>(async ({ user, db, req, params }) => {
  const body = await jsonBody<{ stimulusId: string }>(req);
  return requestPlayback(db, user.id, params.id, String(body.stimulusId));
});
