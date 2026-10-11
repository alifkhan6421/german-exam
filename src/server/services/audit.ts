import "server-only";
import type { Db } from "../db";

/** Append-only audit trail for content and administrative actions. Never log answers or personal content. */
export async function audit(
  db: Db,
  entry: { actorId: string | null; action: string; entityType: string; entityId?: string | null; details?: Record<string, unknown> },
) {
  await db.query(
    `insert into audit_log (actor_id, action, entity_type, entity_id, details) values ($1, $2, $3, $4, $5::jsonb)`,
    [entry.actorId, entry.action, entry.entityType, entry.entityId ?? null, JSON.stringify(entry.details ?? {})],
  );
}
