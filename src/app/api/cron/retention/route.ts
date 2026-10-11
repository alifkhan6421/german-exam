import { NextResponse } from "next/server";
import { getDb } from "@/server/db";
import { purgeExpiredRecordings } from "@/server/services/privacy";

/** Daily retention job (Vercel Cron sends `Authorization: Bearer $CRON_SECRET`). */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await purgeExpiredRecordings(await getDb()));
}
