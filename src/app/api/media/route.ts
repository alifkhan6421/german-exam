import { NextResponse } from "next/server";
import { config } from "@/server/config";
import { readObject, verifyDevSignature, type Bucket } from "@/server/services/storage";

/** Development-only server for HMAC-signed storage URLs. Production uses Supabase signed URLs. */
export async function GET(req: Request) {
  if (config.backend !== "dev") return NextResponse.json({ error: "Not found" }, { status: 404 });
  const u = new URL(req.url);
  const b = u.searchParams.get("b") ?? "";
  const p = u.searchParams.get("p") ?? "";
  const e = u.searchParams.get("e") ?? "";
  const s = u.searchParams.get("s") ?? "";
  if (!["exam-media", "submissions"].includes(b) || !verifyDevSignature(b, p, e, s)) return NextResponse.json({ error: "Invalid or expired link" }, { status: 403 });
  const obj = await readObject(b as Bucket, p);
  if (!obj) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(new Uint8Array(obj.data), { headers: { "Content-Type": obj.contentType, "Cache-Control": "private, max-age=300" } });
}
