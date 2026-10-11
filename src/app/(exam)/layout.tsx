import { requireUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/** Full-screen exam layout: no site navigation while a simulation is running. */
export default async function ExamLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <div className="min-h-dvh bg-ink-100">{children}</div>;
}
