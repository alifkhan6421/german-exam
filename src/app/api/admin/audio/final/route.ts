import { handler, jsonBody } from "@/server/http";
import { DomainError } from "@/server/services/exams";
import { completeFinalUpload, prepareFinalUpload, uploadFinal } from "@/server/services/audio";

function parseProduction(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw as Record<string, unknown>;
  try {
    const v = JSON.parse(String(raw ?? "{}"));
    return v && typeof v === "object" && !Array.isArray(v) ? v : {};
  } catch {
    throw new DomainError("Invalid production metadata.");
  }
}

/**
 * Final listening audio.
 * - JSON {step:"prepare"}: returns a one-time signed upload token (Supabase), or {direct:true} in development.
 * - JSON {step:"complete"}: records a file uploaded with that token.
 * - multipart: uploads through the server (development storage only; serverless bodies are small).
 */
export const POST = handler(
  async ({ user, db, req }) => {
    if (req.headers.get("content-type")?.includes("application/json")) {
      const body = await jsonBody<Record<string, unknown>>(req);
      const versionId = String(body.versionId);
      const scriptId = String(body.scriptId);
      const mime = String(body.mime ?? "");
      if (body.step === "prepare") {
        const signed = await prepareFinalUpload(db, { versionId, scriptId, mime, bytes: Number(body.bytes) });
        return signed ?? { direct: true };
      }
      if (body.step === "complete") {
        const id = await completeFinalUpload(db, user, {
          assetId: String(body.assetId),
          versionId,
          scriptId,
          mime,
          durationSec: Number(body.durationSec) || 0,
          production: parseProduction(body.production),
          provider: body.provider === "upload" ? "upload" : "studio_mix",
        });
        return { assetId: id };
      }
      throw new DomainError("Unknown step.");
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) throw new DomainError("Missing file.");
    const id = await uploadFinal(db, user, {
      versionId: String(form.get("versionId")),
      scriptId: String(form.get("scriptId")),
      data: Buffer.from(await file.arrayBuffer()),
      mime: file.type || "audio/wav",
      durationSec: Number(form.get("durationSec")) || 0,
      production: parseProduction(form.get("production")),
      provider: form.get("provider") === "upload" ? "upload" : "studio_mix",
    });
    return { assetId: id };
  },
  { permission: "audio.produce", limit: { key: "audio-upload", max: 60, windowMs: 600_000 } },
);
