import "server-only";
import fs from "node:fs";
import path from "node:path";
import { config } from "../config";

/**
 * Minimal database interface shared by the embedded development database (PGlite) and
 * production Postgres (Supabase via node-postgres). All SQL is plain Postgres.
 *
 * JSON values must be passed as strings and cast in SQL (`$1::jsonb`) so both drivers
 * behave identically.
 */
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  one<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | undefined>;
  /** Run a multi-statement script without parameters (migrations). */
  exec(sql: string): Promise<void>;
  tx<T>(fn: (db: Db) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

type Queryable = {
  query: (sql: string, params?: unknown[]) => Promise<{ rows: unknown[] }>;
  exec: (sql: string) => Promise<unknown>;
};

function wrap(q: Queryable, txImpl: Db["tx"], close: () => Promise<void>): Db {
  const db: Db = {
    async query<T>(sql: string, params?: unknown[]) {
      const r = await q.query(sql, params);
      return r.rows as T[];
    },
    async one<T>(sql: string, params?: unknown[]) {
      const r = await q.query(sql, params);
      return r.rows[0] as T | undefined;
    },
    async exec(sql: string) {
      await q.exec(sql);
    },
    tx: txImpl,
    close,
  };
  return db;
}

async function createPglite(dataDir: string): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite");
  const { pgcrypto } = await import("@electric-sql/pglite/contrib/pgcrypto");
  if (!dataDir.startsWith("memory://")) fs.mkdirSync(dataDir, { recursive: true });
  const pg = await PGlite.create(dataDir, { extensions: { pgcrypto } });
  // PGlite is single-connection: serialise transactions so concurrent requests don't interleave.
  let chain: Promise<unknown> = Promise.resolve();
  const runExclusive = <T>(fn: () => Promise<T>): Promise<T> => {
    const next = chain.then(fn, fn);
    chain = next.catch(() => undefined);
    return next;
  };
  const base: Queryable = {
    query: (sql, params) => runExclusive(() => pg.query(sql, params as unknown[])),
    exec: (sql) => runExclusive(() => pg.exec(sql)),
  };
  const txImpl: Db["tx"] = (fn) =>
    runExclusive(() =>
      pg.transaction(async (tx) => {
        const inner: Queryable = { query: (sql, params) => tx.query(sql, params as unknown[]), exec: (sql) => tx.exec(sql) };
        const nested: Db = wrap(inner, (f) => f(nested), async () => {});
        return fn(nested);
      }),
    );
  return wrap(base, txImpl, () => pg.close());
}

export async function createPg(connectionString: string): Promise<Db> {
  const { Pool } = await import("pg");
  const pool = new Pool({ connectionString, max: 5, ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false } });
  const txImpl: Db["tx"] = async (fn) => {
    const client = await pool.connect();
    try {
      await client.query("begin");
      const nested: Db = wrap({ query: (sql, p) => client.query(sql, p), exec: (sql) => client.query(sql) }, (f) => f(nested), async () => {});
      const out = await fn(nested);
      await client.query("commit");
      return out;
    } catch (e) {
      await client.query("rollback");
      throw e;
    } finally {
      client.release();
    }
  };
  return wrap({ query: (sql, p) => pool.query(sql, p), exec: (sql) => pool.query(sql) }, txImpl, () => pool.end());
}

export async function migrate(db: Db, opts: { includeDev: boolean; root?: string }) {
  const root = opts.root ?? process.cwd();
  await db.query(`create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())`);
  const applied = new Set((await db.query<{ name: string }>(`select name from _migrations`)).map((r) => r.name));
  const dirs = [path.join(root, "supabase/migrations"), ...(opts.includeDev ? [path.join(root, "supabase/dev")] : [])];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
      const name = `${path.basename(dir)}/${file}`;
      if (applied.has(name)) continue;
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      if (opts.includeDev && sql.startsWith("-- @supabase-only")) continue;
      await db.tx(async (tx) => {
        await tx.exec(sql);
        await tx.query(`insert into _migrations (name) values ($1)`, [name]);
      });
    }
  }
}

const g = globalThis as unknown as { __db?: Promise<Db> };

/** Process-wide database. In development, migrations and seed data are applied on first use. */
export function getDb(): Promise<Db> {
  if (!g.__db) {
    g.__db = (async () => {
      if (config.backend === "supabase") return createPg(config.supabase.databaseUrl!);
      const db = await createPglite(path.join(config.dev.dataDir, "pglite"));
      await migrate(db, { includeDev: true });
      const { seed } = await import("./seed");
      await seed(db, { dev: true });
      return db;
    })();
    g.__db.catch(() => {
      g.__db = undefined;
    });
  }
  return g.__db;
}

/** Fresh in-memory database for tests. */
export async function createTestDb(opts: { devSeed?: boolean } = {}): Promise<Db> {
  const db = await createPglite("memory://");
  await migrate(db, { includeDev: true });
  const { seed } = await import("./seed");
  await seed(db, { dev: opts.devSeed ?? true });
  return db;
}

/** Test hook: route getDb() to a specific database. */
export function setDbForTests(db: Db) {
  g.__db = Promise.resolve(db);
}
