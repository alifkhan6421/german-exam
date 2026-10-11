import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { getAttemptView } from "@/server/services/attempts";
import { DomainError } from "@/server/services/exams";
import { Simulator } from "@/components/exam/simulator";

export const metadata = { title: "Exam" };

export default async function AttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const db = await getDb();
  let view;
  try {
    view = await getAttemptView(db, user.id, id);
  } catch (e) {
    if (e instanceof DomainError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
  if (view.status === "submitted") redirect(`/attempts/${id}/results`);
  return <Simulator initial={view} />;
}
