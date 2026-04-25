type QueryResult<T> = { rows: T[]; rowCount: number | null };

export interface DbPool {
  query<T = unknown>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
  connect(): Promise<{
    query<T = unknown>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
    release(): void;
  }>;
}

let pool: DbPool | null = null;

export function getDbPool(): DbPool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for PostgreSQL mode");
  }

  if (!pool) {
    // Lazy-load pg so in-memory mode can run without postgres dependencies installed.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg") as { Pool: new (opts: { connectionString: string }) => DbPool };
    pool = new Pool({ connectionString: databaseUrl });
  }

  return pool;
}
