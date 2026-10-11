import { handler, jsonBody } from "@/server/http";
import { requestAiAssessment } from "@/server/services/assessment";

export const POST = handler<{ id: string }>(
  async ({ user, db, req, params }) => {
    const body = await jsonBody<{ itemId: string }>(req);
    return requestAiAssessment(db, user, params.id, String(body.itemId));
  },
  { limit: { key: "assess", max: 10, windowMs: 60_000 } },
);
