import { handler, jsonBody } from "@/server/http";
import { checkAnswer } from "@/server/services/attempts";

export const POST = handler<{ id: string }>(async ({ user, db, req, params }) => {
  const body = await jsonBody<{ itemId: string }>(req);
  return checkAnswer(db, user, params.id, String(body.itemId));
});
