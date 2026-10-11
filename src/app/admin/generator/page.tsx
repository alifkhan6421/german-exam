import Link from "next/link";
import { getBlueprint } from "@/domain/blueprints";
import { ExamContentSchema } from "@/domain/exam/schema";
import { requirePermission } from "@/server/auth/session";
import { config } from "@/server/config";
import { getDb } from "@/server/db";
import { listExams, skeletonContent } from "@/server/services/exams";
import { listJobs } from "@/server/services/generator";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Table, Td, Th } from "@/components/ui/table";
import { GeneratorForm, type GenExam } from "@/components/admin/generator-form";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "AI generator" };
export const maxDuration = 300;

export default async function GeneratorPage({ searchParams }: { searchParams: Promise<{ exam?: string }> }) {
  await requirePermission("ai.generate");
  const { exam: initialExam } = await searchParams;
  const db = await getDb();
  const [exams, jobs] = await Promise.all([listExams(db), listJobs(db)]);
  const versions = await db.query<{ id: string; content: unknown }>(`select v.id, v.content from exam_versions v join exams e on e.current_version_id = v.id`);
  const genExams: GenExam[] = exams.filter((e) => e.status !== "archived").map((e) => {
    const bp = getBlueprint(e.track_key)!;
    const raw = versions.find((v) => v.id === e.current_version_id)?.content;
    const parsed = raw ? ExamContentSchema.safeParse(raw) : undefined;
    const content = parsed?.success ? parsed.data : skeletonContent(bp, e.title);
    return {
      id: e.id,
      title: e.title,
      sections: content.sections.map((s) => {
        const bs = bp.sections.find((b) => b.id === s.sectionId);
        return {
          id: s.sectionId,
          title: bs?.titleDe ?? s.sectionId,
          parts: s.parts.map((p) => ({
            id: p.partId,
            title: bs?.parts.find((x) => x.id === p.partId)?.titleDe ?? p.partId,
            items: p.items.map((i) => ({ id: i.id, number: i.number })),
            stimuli: p.stimuli.map((st) => ({ id: st.id, label: `${st.label ?? st.kind} ${st.title ?? st.id}` })),
          })),
        };
      }),
    };
  });
  return (
    <>
      <PageHeader title="AI exam generator" description="Generate a whole exam, a section, a part, a single item or a single text from the blueprint. Every result is validated and needs human review." />
      {!config.llm.configured && <Alert tone="warning" className="mb-4" title="Not configured">Set ANTHROPIC_API_KEY on the server to enable generation. Model: {config.llm.generationModel}.</Alert>}
      <Card className="mb-6">
        <CardHeader><CardTitle>New generation</CardTitle></CardHeader>
        <CardContent><GeneratorForm exams={genExams} initialExam={initialExam} configured={config.llm.configured} /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent jobs</CardTitle></CardHeader>
        <CardContent className="p-0">
          {jobs.length === 0 ? <p className="p-5 text-sm text-ink-500">No generations yet.</p> : (
            <Table>
              <thead><tr><Th>Exam</Th><Th>Scope</Th><Th>Status</Th><Th className="hidden md:table-cell">Started</Th><Th /></tr></thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <Td>{j.exam_title ?? j.track_key}</Td>
                    <Td>{j.scope} {[j.target.partId, j.target.itemId ?? j.target.stimulusId].filter(Boolean).join(" / ")}</Td>
                    <Td><Badge tone={j.status === "succeeded" ? (j.validation?.ok ? "success" : "warning") : j.status === "failed" ? "danger" : "neutral"}>{j.status === "succeeded" && !j.validation?.ok ? "needs fixes" : j.status}</Badge>{j.target.appliedVersionId && <Badge className="ml-1">saved</Badge>}</Td>
                    <Td className="hidden md:table-cell text-xs">{formatDateTime(j.created_at)} · {j.email}</Td>
                    <Td className="text-right"><Link className="text-brand-700 hover:underline" href={`/admin/generator/${j.id}`}>Open</Link></Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
