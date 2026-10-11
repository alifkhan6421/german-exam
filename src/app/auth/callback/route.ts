import { NextResponse, type NextRequest } from "next/server";
import { config } from "@/server/config";
import { supabaseServer } from "@/server/auth/session";

/** Supabase Auth email links (sign-up confirmation) land here and exchange the code for a session. */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const nextParam = req.nextUrl.searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/dashboard";
  if (config.backend !== "supabase" || !code) return NextResponse.redirect(new URL("/login", req.url));
  const sb = await supabaseServer();
  const { error } = await sb.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(error ? "/login?error=link" : next, req.url));
}
