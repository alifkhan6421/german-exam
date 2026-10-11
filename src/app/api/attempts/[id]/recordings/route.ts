import { handler } from "@/server/http";
import { uploadRecording } from "@/server/services/attempts";
import { DomainError } from "@/server/services/exams";

export const POST = handler<{ id: string }>(
  async ({ user, db, req, params }) => {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) throw new DomainError("No recording received.");
    const data = Buffer.from(await file.arrayBuffer());
    return uploadRecording(db, user, params.id, String(form.get("itemId")), {
      data,
      mime: (file.type || "audio/webm").split(";")[0],
      durationSec: Math.max(0, Math.min(3600, Number(form.get("durationSec")) || 0)),
    });
  },
  { limit: { key: "recordings", max: 30, windowMs: 60_000 } },
);
