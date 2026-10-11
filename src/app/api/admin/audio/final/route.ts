import { handler } from "@/server/http";
import { DomainError } from "@/server/services/exams";
import { uploadFinal } from "@/server/services/audio";

export const POST = handler(
  async ({ user, db, req }) => {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) throw new DomainError("Missing file.");
    let production: Record<string, unknown> = {};
    try {
      production = JSON.parse(String(form.get("production") ?? "{}"));
    } catch {
      throw new DomainError("Invalid production metadata.");
    }
    const id = await uploadFinal(db, user, {
      versionId: String(form.get("versionId")),
      scriptId: String(form.get("scriptId")),
      data: Buffer.from(await file.arrayBuffer()),
      mime: file.type || "audio/wav",
      durationSec: Number(form.get("durationSec")) || 0,
      production,
      provider: form.get("provider") === "upload" ? "upload" : "studio_mix",
    });
    return { assetId: id };
  },
  { permission: "audio.produce", limit: { key: "audio-upload", max: 30, windowMs: 600_000 } },
);
