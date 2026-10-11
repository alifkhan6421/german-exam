import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Gauge, Layers } from "lucide-react";
import { averageScore, recommendations, skillAverages, type AttemptForStats } from "@/domain/analytics";
import { requireUser } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { listUserAttempts } from "@/server/services/attempts";
import { getEntitlements, userSubscriptions } from "@/server/services/entitlements";
import { getTrack } from "@/server/services/exams";
import { resultPercent } from "@/server/services/catalogue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert } from "@/components/ui/alert";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ProviderCards } from "@/components/catalogue/provider-cards";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const user = await requireUser();
  if (!user.onboarded) redirect("/onboarding");
  const { denied } = await searchParams;
  const db = await getDb();
  const [attempts, subs, ent, track] = await Promise.all([
    listUserAttempts(db, user.id),
    userSubscriptions(db, user.id),
    getEntitlements(db, user.id),
    user.targetTrack ? getTrack(db, user.targetTrack) : Promise.resolve(undefined),
  ]);
  const stats: AttemptForStats[] = attempts.map((a) => ({ id: a.id, title: a.title, trackKey: a.track_key, startedAt: a.started_at, submittedAt: a.submitted_at, result: a.result }));
  const completed = attempts.filter((a) => a.status === "submitted");
  const avg = averageScore(stats);
  const skills = skillAverages(stats);
  const recs = recommendations(stats);
  const activeSub = subs.find((s) => ["active", "trialing", "past_due"].includes(s.status));
  const daysLeft = user.examDate ? Math.ceil((new Date(user.examDate).getTime() - Date.now()) / 86400000) : null;

  return (
    <div className="flex flex-col gap-8">
      {denied && <Alert tone="warning">You don&apos;t have permission to open that page.</Alert>}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Hallo, {user.displayName}!</h1>
        <p className="text-ink-500">Here is where your preparation stands.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="flex flex-col gap-1 pt-5">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500"><Layers className="h-3.5 w-3.5" />Target exam</span>
          <span className="font-semibold">{track?.title ?? "Not set"}</span>
          <Link href="/settings" className="text-xs text-brand-700 hover:underline">Change</Link>
        </CardContent></Card>
        <Card><CardContent className="flex flex-col gap-1 pt-5">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500"><CalendarDays className="h-3.5 w-3.5" />Exam date</span>
          <span className="font-semibold">{user.examDate ? formatDate(user.examDate) : "Not set"}</span>
          {daysLeft !== null && <span className="text-xs text-ink-500">{daysLeft >= 0 ? `${daysLeft} days to go` : "Date has passed"}</span>}
        </CardContent></Card>
        <Card><CardContent className="flex flex-col gap-1 pt-5">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500"><CheckCircle2 className="h-3.5 w-3.5" />Completed</span>
          <span className="text-2xl font-semibold">{completed.length}</span>
          <span className="text-xs text-ink-500">mock exams and section practices</span>
        </CardContent></Card>
        <Card><CardContent className="flex flex-col gap-1 pt-5">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-500"><Gauge className="h-3.5 w-3.5" />Average practice score</span>
          <span className="text-2xl font-semibold">{avg === null ? "—" : `${avg}%`}</span>
          <span className="text-xs text-ink-500">across completed sections</span>
        </CardContent></Card>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">Choose your exam</h2>
          {track && (
            <div className="flex gap-2">
              <ButtonLink size="sm" href={`/exams/${track.provider}/${track.level.toLowerCase()}`}>Full exam simulation</ButtonLink>
              <ButtonLink size="sm" variant="secondary" href={`/exams/${track.provider}/${track.level.toLowerCase()}?practice=1`}>Section practice</ButtonLink>
            </div>
          )}
        </div>
        <ProviderCards />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent attempts</CardTitle></CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <p className="text-sm text-ink-500">No attempts yet. Start with the free Goethe A1 Übungstest 1.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {attempts.slice(0, 6).map((a) => {
                  const pct = resultPercent(a.result);
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-ink-800">{a.title}</span>
                        <span className="text-xs text-ink-500">{a.mode === "exam" ? "Exam mode" : "Practice"} · {a.section_ids.length} section{a.section_ids.length > 1 ? "s" : ""} · {formatDateTime(a.started_at)}</span>
                      </div>
                      {a.status === "in_progress" ? (
                        <ButtonLink size="sm" variant="secondary" href={`/attempts/${a.id}`}>Resume</ButtonLink>
                      ) : (
                        <Link href={`/attempts/${a.id}/results`} className="flex items-center gap-2 text-brand-700 hover:underline">
                          {pct === null ? <Badge tone="warning">Awaiting assessment</Badge> : <span className="font-semibold">{pct}%</span>}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Performance by skill</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
              {skills.length === 0 && <p className="text-sm text-ink-500">Complete a section to see your skill profile.</p>}
              {skills.map((s) => (
                <div key={s.skill} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm"><span>{s.label}</span><span className="font-medium">{s.average}%</span></div>
                  <Progress value={s.average} tone={s.average >= 60 ? "success" : "warning"} label={`${s.label} average`} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recommended next</CardTitle></CardHeader>
            <CardContent>
              {recs.length === 0 ? <p className="text-sm text-ink-500">Recommendations appear after your first completed section.</p> : (
                <ul className="flex list-disc flex-col gap-2 pl-4 text-sm text-ink-700">{recs.map((r) => <li key={r}>{r}</li>)}</ul>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>{activeSub ? `${activeSub.planName} · ${activeSub.status}${activeSub.source === "dev_simulated" ? " (simulated)" : ""}` : "Free plan"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-ink-600">
              <span>{ent.premiumExams ? "All published premium exams unlocked." : "Premium mock exams are locked."}</span>
              <ButtonLink size="sm" variant="secondary" href="/settings/billing" className="self-start">{activeSub ? "Manage" : "Upgrade"}</ButtonLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
