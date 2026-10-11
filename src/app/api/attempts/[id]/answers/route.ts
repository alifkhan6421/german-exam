import { handler, jsonBody } from "@/server/http";
import { clearAnswer, saveAnswer } from "@/server/services/attempts";

export const PUT = handler<{ id: string }>(
  async ({ user, db, req, params }) => {
    const body = await jsonBody<{ itemId: string; value: unknown }>(req);
    return saveAnswer(db, user.id, params.id, String(body.itemId), body.value);
  },
  { limit: { key: "answers", max: 240, windowMs: 60_000 } },
);

export const DELETE = handler<{ id: string }>(async ({ user, db, req, params }) => {
  const itemId = new URL(req.url).searchParams.get("itemId") ?? "";
  await clearAnswer(db, user.id, params.id, itemId);
});
