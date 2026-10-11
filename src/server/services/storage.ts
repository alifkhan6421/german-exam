import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import { DomainError } from "./exams";

/**
 * Private object storage. Production: Supabase Storage (private buckets, signed URLs).
 * Development: files under DEV_DATA_DIR/storage, served by /api/media with HMAC-signed,
 * expiring URLs that mimic Supabase signed URLs.
 */
export type Bucket = "exam-media" | "submissions";

function safePath(p: string) {
  const norm = path.posix.normalize(p).replace(/^(\.\.(\/|$))+/, "");
  if (norm.startsWith("/") || norm.includes("..")) throw new Error("Invalid storage path");
  return norm;
}

export async function supabaseAdmin() {
  if (!config.supabase.serviceKey) throw new DomainError("File storage is not configured on this server (SUPABASE_SERVICE_ROLE_KEY is missing).", 503);
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(config.supabase.url!, config.supabase.serviceKey!, { auth: { persistSession: false } });
}

export async function putObject(bucket: Bucket, objectPath: string, data: Buffer, contentType: string) {
  const p = safePath(objectPath);
  if (config.backend === "supabase") {
    const sb = await supabaseAdmin();
    const { error } = await sb.storage.from(bucket).upload(p, data, { contentType, upsert: true });
    if (error) throw new Error(`Storage upload failed: ${error.message}`);
    return p;
  }
  const full = path.join(config.dev.dataDir, "storage", bucket, p);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
  await fs.writeFile(full + ".meta", JSON.stringify({ contentType }));
  return p;
}

export async function deleteObject(bucket: Bucket, objectPath: string) {
  const p = safePath(objectPath);
  if (config.backend === "supabase") {
    const sb = await supabaseAdmin();
    await sb.storage.from(bucket).remove([p]);
    return;
  }
  const full = path.join(config.dev.dataDir, "storage", bucket, p);
  await fs.rm(full, { force: true });
  await fs.rm(full + ".meta", { force: true });
}

export async function readObject(bucket: Bucket, objectPath: string): Promise<{ data: Buffer; contentType: string } | null> {
  const p = safePath(objectPath);
  if (config.backend === "supabase") {
    const sb = await supabaseAdmin();
    const { data, error } = await sb.storage.from(bucket).download(p);
    if (error || !data) return null;
    return { data: Buffer.from(await data.arrayBuffer()), contentType: data.type || "application/octet-stream" };
  }
  const full = path.join(config.dev.dataDir, "storage", bucket, p);
  try {
    const data = await fs.readFile(full);
    const meta = JSON.parse(await fs.readFile(full + ".meta", "utf8").catch(() => "{}"));
    return { data, contentType: meta.contentType ?? "application/octet-stream" };
  } catch {
    return null;
  }
}

function sign(payload: string) {
  return createHmac("sha256", config.dev.sessionSecret).update(payload).digest("base64url");
}

/** Short-lived URL for a private object. Callers must authorise access first. */
export async function signedUrl(bucket: Bucket, objectPath: string, ttlSeconds = 300): Promise<string> {
  const p = safePath(objectPath);
  if (config.backend === "supabase") {
    const sb = await supabaseAdmin();
    const { data, error } = await sb.storage.from(bucket).createSignedUrl(p, ttlSeconds);
    if (error || !data) throw new Error(`Could not sign URL: ${error?.message}`);
    return data.signedUrl;
  }
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${bucket}:${p}:${exp}`;
  return `/api/media?b=${encodeURIComponent(bucket)}&p=${encodeURIComponent(p)}&e=${exp}&s=${sign(payload)}`;
}

export function verifyDevSignature(bucket: string, p: string, exp: string, sig: string): boolean {
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(`${bucket}:${p}:${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
