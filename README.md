# Digital Gold Platform

AI-powered digital jewellery catalogue platform focused on discovery, AI-assisted recommendations, and lead generation.

## Monorepo Layout

- `apps/web`: Next.js frontend (catalog, AI chat UI, lead capture)
- `apps/api`: Node.js/NestJS-style modular API skeleton
- `apps/worker`: Background workers for async jobs (indexing, embeddings, notifications)
- `packages/shared`: Shared types/contracts/DTOs
- `docs`: Product and engineering planning docs

## Implementation Phases

See `docs/implementation-phases.md` for the delivery roadmap.

## Quick Start (after dependencies are installed)

```bash
npm install
npm run dev:web
npm run dev:api
npm run dev:worker
```

## Docker Quick Start (recommended for consistent dev setup)

Run full stack:

```bash
npm run docker:up
```

Access:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- OpenSearch: `http://localhost:9200` (or `${OPENSEARCH_HOST_PORT}`)

Default Docker host ports:
- PostgreSQL: `5433`
- Redis: `6380`
- OpenSearch: `9200`

If you need different ports, copy `.env.docker.example` to `.env` and set:
- `POSTGRES_HOST_PORT`
- `REDIS_HOST_PORT`
- `OPENSEARCH_HOST_PORT`
- `OPENSEARCH_METRICS_HOST_PORT`

Stop stack:

```bash
npm run docker:down
```

If startup fails after image/version changes, do a clean reset:

```bash
docker compose down -v --remove-orphans
docker compose pull
npm run docker:up
```

If web shows `.next` manifest `ENOENT` errors, reset web caches/volumes:

```bash
docker compose down
docker volume rm digital_gold_dg_web_next digital_gold_dg_web_node_modules || true
npm run docker:up
```

Useful:
- `npm run docker:logs`
- `npm run docker:ps`

Files:
- `docker-compose.yml`
- `docker/Dockerfile.dev`
- `.env.docker.example`

## PostgreSQL Mode (Phase 3)

Set:
- `DATABASE_URL=postgres://user:pass@host:5432/dbname`
- `REPOSITORY_MODE=postgres` (optional when `DATABASE_URL` is present)

Run migrations:

```bash
npm run db:migrate
```

## Queue Mode (BullMQ)

Set:
- `QUEUE_MODE=bullmq`
- `REDIS_URL=redis://127.0.0.1:6379`

Default is `QUEUE_MODE=memory`, which logs queue events but does not use Redis.

## Test Commands

- `npm run test` (runs API + worker tests)
- `npm run test:api`
- `npm run test:worker`
- `npm run validate:connected` (requires connected services + modes)

## Search and Embeddings Mode (Worker)

Search:
- `SEARCH_MODE=memory` (default) or `SEARCH_MODE=opensearch`
- `OPENSEARCH_URL=http://127.0.0.1:9200`
- `OPENSEARCH_INDEX=products`
- Optional auth:
  - `OPENSEARCH_API_KEY=...` or
  - `OPENSEARCH_USERNAME=...` and `OPENSEARCH_PASSWORD=...`

Embeddings:
- `EMBEDDING_MODE=mock` (default) or `EMBEDDING_MODE=openai-compatible`
- For `openai-compatible`:
  - `EMBEDDING_API_BASE_URL=...`
  - `EMBEDDING_API_KEY=...`
  - Optional `EMBEDDING_MODEL=text-embedding-3-small`

Connected runbook:
- `docs/connected-mode-validation.md`
