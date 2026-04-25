import { runMigrations } from "../infra/postgres/migrate";

runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("[migration] failed", error);
    process.exit(1);
  });
