import { requirePermission } from "@/server/auth/session";
import { getDb } from "@/server/db";
import { PageHeader } from "@/components/ui/page-header";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Audit log" };

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ action?: string }> }) {
  await requirePermission("audit.view");
  const { action } = await searchParams;
  const rows = await (await getDb()).query<{ id: string; action: string; entity_type: string; entity_id: string | null; details: unknown; at: string; email: string | null }>(
    `select l.id, l.action, l.entity_type, l.entity_id, l.details, l.at, p.email from audit_log l left join profiles p on p.id = l.actor_id
     where ($1::text is null or l.action like $1 || '%') order by l.at desc limit 300`,
    [action?.trim() || null],
  );
  return (
    <>
      <PageHeader title="Audit log" description="Content, review, publication, billing, role and privacy events." />
      <form className="mb-4"><input name="action" defaultValue={action} placeholder="Filter by action prefix, e.g. exam. or billing." className="h-10 w-full max-w-sm rounded-md border border-ink-200 px-3 text-sm" /></form>
      <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
        <Table>
          <thead><tr><Th>When</Th><Th>Who</Th><Th>Action</Th><Th>Entity</Th><Th>Details</Th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <Td className="whitespace-nowrap text-xs">{formatDateTime(r.at)}</Td>
                <Td className="text-xs">{r.email ?? "system"}</Td>
                <Td className="font-mono text-xs">{r.action}</Td>
                <Td className="text-xs">{r.entity_type} {r.entity_id?.slice(0, 18)}</Td>
                <Td className="max-w-md truncate font-mono text-xs" title={JSON.stringify(r.details)}>{JSON.stringify(r.details)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
