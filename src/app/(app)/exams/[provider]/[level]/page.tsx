import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Layers, Lock } from "lucide-react";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { trackFor } from "@/server/services/exams";
import { catalogueForUser, type CatalogueStatus } from "@/server/services/catalogue";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { isProvider, PROVIDERS } from "@/lib/utils";

const STATUS: Record<CatalogueStatus, { label: string; tone: "neutral" | "brand" | "success" | "warning" }> = {
  not_started: { label: "Not started", tone: "neutral" },
  in_progress: { label: "In progress", tone: "brand" },
  completed: { label: "Completed", tone: "success" },
  locked: { label: "Locked", tone: "warning" },
  unavailable: { label: "In production", tone: "neutral" },
};

export default async function LevelCataloguePage({ params, searchParams }: { params: Promise<{ provider: string; level: string }>; searchParams: Promise<{ practice?: string }> }) {
  const { provider, level } = await params;
  const { practice } = await searchParams;
  if (!isProvider(provider)) notFound();
  const user = await requireUser();
  const db = await getDb();
  const track = await trackFor(db, provider, level);
  if (!track) notFound();
  const entries = await catalogueForUser(db, user.id, track);
  return (
    <>
      <PageHeader
        eyebrow={<><Link href="/exams" className="hover:underline">Exams</Link> / <Link href={`/exams/${provider}`} className="hover:underline">{PROVIDERS[provider].long}</Link></>}
        title={`${provider === "goethe" ? "Goethe" : "telc"} ${track.level} — Mock examinations`}
        description={track.title}
      />
      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        <Table>
          <thead><tr><Th>Mock exam</Th><Th className="hidden md:table-cell">Details</Th><Th>Status</Th><Th className="text-right">Action</Th></tr></thead>
          <tbody>
            {entries.map((e) => {
              const st = STATUS[e.status];
              const slug = `/exams/${provider}/${level}/${e.exam.mock_number}${practice ? "?practice=1" : ""}`;
              return (
                <tr key={e.exam.id}>
                  <Td>
                    <div className="flex flex-col">
                      <span className="font-medium">Mock Test {e.exam.mock_number}</span>
                      <span className="text-xs text-ink-500">{e.exam.access_tier === "free" ? "Free" : "Premium"}{e.attempts ? ` · ${e.attempts} attempt${e.attempts > 1 ? "s" : ""}` : ""}{e.lastScorePercent != null ? ` · last ${e.lastScorePercent}%` : ""}</span>
                    </div>
                  </Td>
                  <Td className="hidden md:table-cell">
                    <span className="flex flex-wrap gap-3 text-xs text-ink-500">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.durationMinutes ? `${Math.round(e.durationMinutes)} min` : "per module"}</span>
                      <span className="inline-flex items-center gap-1"><Layers className="h-3.5 w-3.5" />{e.sectionCount} sections</span>
                      <span>{e.difficulty}</span>
                    </span>
                  </Td>
                  <Td><Badge tone={st.tone}>{st.label}</Badge></Td>
                  <Td className="text-right">
                    {e.status === "not_started" && <ButtonLink size="sm" href={slug}>{practice ? "Practise" : "Start exam"}</ButtonLink>}
                    {e.status === "in_progress" && <ButtonLink size="sm" href={`/attempts/${e.inProgressAttemptId}`}>Resume</ButtonLink>}
                    {e.status === "completed" && (
                      <span className="flex justify-end gap-2">
                        <ButtonLink size="sm" variant="secondary" href={`/attempts/${e.lastResultAttemptId}/results`}>View results</ButtonLink>
                        <ButtonLink size="sm" variant="ghost" href={slug}>Retake</ButtonLink>
                      </span>
                    )}
                    {e.status === "locked" && <ButtonLink size="sm" variant="secondary" href="/settings/billing"><Lock className="h-3.5 w-3.5" />Subscribe</ButtonLink>}
                    {e.status === "unavailable" && <span className="text-xs text-ink-400">Coming soon</span>}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
      <p className="mt-4 text-xs text-ink-500">Exams marked “In production” are being written and reviewed. They only appear once every task, recording, answer key and review is complete.</p>
    </>
  );
}
