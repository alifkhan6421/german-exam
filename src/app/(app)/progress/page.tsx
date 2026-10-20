import Link from "next/link";
import { Lock } from "lucide-react";
import { getBlueprint } from "@/domain/blueprints";
import { partAccuracy, recommendations, skillAverages, skillTimeline, type AttemptForStats } from "@/domain/analytics";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { listUserAttempts } from "@/server/services/attempts";
import { resultPercent } from "@/server/services/catalogue";
import { getEntitlements } from "@/server/services/entitlements";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Table, Td, Th } from "@/components/ui/table";
import { TrendChart } from "@/components/progress/trend-chart";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Progress" };

export default async function ProgressPage() {
  const user = await requireUser();
  const db = await getDb();
  const [attempts, ent] = await Promise.all([listUserAttempts(db, user.id, 200), getEntitlements(db, user.id)]);
  const stats: AttemptForStats[] = attempts.map((a) => ({ id: a.id, title: a.title, trackKey: a.track_key, startedAt: new Date(a.started_at).toISOString(), submittedAt: a.submitted_at ? new Date(a.submitted_at).toISOString() : null, result: a.result }));
  const skills = skillAverages(stats);
  const full = ent.progressAnalytics === "full";
  const parts = partAccuracy(stats).sort((a, b) => a.percent - b.percent);
  const recs = recommendations(stats);

  if (!attempts.some((a) => a.status === "submitted")) {
    return (
      <>
        <PageHeader title="Progress" />
        <EmptyState title="No results yet" action={<ButtonLink href="/exams">Choose an exam</ButtonLink>}>Complete a mock exam or a section practice to see your progress here.</EmptyState>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Progress" description="Practice scores across your completed sections. AI-assessed sections count as provisional until reviewed." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => (
          <Card key={s.skill}><CardContent className="flex flex-col gap-2 pt-5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-500">{s.label}</span>
            <span className="text-2xl font-semibold">{s.average}%</span>
            <Progress value={s.average} />
            <span className="text-xs text-ink-500">latest {s.latest}% · {s.count} result{s.count > 1 ? "s" : ""}</span>
          </CardContent></Card>
        ))}
      </div>

      {recs.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent><ul className="flex list-disc flex-col gap-1 pl-5 text-sm">{recs.map((r) => <li key={r}>{r}</li>)}</ul></CardContent>
        </Card>
      )}

      {full ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Trend</CardTitle></CardHeader>
            <CardContent><TrendChart points={skillTimeline(stats)} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Weakest task types</CardTitle><CardDescription>Accuracy on automatically scored items, per exam part.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {parts.slice(0, 8).map((p) => {
                const bp = getBlueprint(p.trackKey);
                const part = bp?.sections.find((s) => s.id === p.sectionId)?.parts.find((x) => x.id === p.partId);
                return (
                  <div key={`${p.trackKey}:${p.partId}`} className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between"><span>{bp ? `${bp.provider === "goethe" ? "Goethe" : "telc"} ${bp.level} · ` : ""}{part?.titleDe ?? p.partId}</span><span className="tabular-nums">{p.percent}% ({p.correct}/{p.total})</span></div>
                    <Progress value={p.percent} />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white p-4 text-sm">
          <Lock className="h-4 w-4 text-ink-500" /> Trend charts and task-type analysis are part of Premium. <Link className="text-brand-700 underline" href="/settings/billing">See plans</Link>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <thead><tr><Th>Exam</Th><Th className="hidden sm:table-cell">Mode</Th><Th className="hidden md:table-cell">Date</Th><Th>Score</Th><Th className="text-right" /></tr></thead>
            <tbody>
              {attempts.map((a) => {
                const pct = resultPercent(a.result);
                return (
                  <tr key={a.id}>
                    <Td className="font-medium">{a.title}</Td>
                    <Td className="hidden sm:table-cell">{a.mode === "exam" ? "Simulation" : "Practice"}</Td>
                    <Td className="hidden md:table-cell">{formatDateTime(a.submitted_at ?? a.started_at)}</Td>
                    <Td>{a.status !== "submitted" ? <Badge tone="warning">In progress</Badge> : pct === null ? <Badge>Pending</Badge> : `${pct}%`}</Td>
                    <Td className="text-right"><Link className="text-brand-700 hover:underline" href={a.status === "submitted" ? `/attempts/${a.id}/results` : `/attempts/${a.id}`}>{a.status === "submitted" ? "Results" : "Resume"}</Link></Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
