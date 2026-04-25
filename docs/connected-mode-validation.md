# Connected Mode Validation Runbook

This runbook validates the full connected stack for Phase 3:
- PostgreSQL persistence mode
- BullMQ + Redis queue mode
- Worker indexing + embedding jobs
- OpenSearch document upsert/delete

## 1) Required Services

Ensure these are running and reachable:
- PostgreSQL
- Redis
- OpenSearch

## 2) Required Environment Variables

API/worker shared:
- `API_BASE_URL=http://127.0.0.1:4000`

API:
- `DATABASE_URL=postgres://user:pass@host:5432/dbname`
- `REPOSITORY_MODE=postgres`
- `QUEUE_MODE=bullmq`
- `REDIS_URL=redis://127.0.0.1:6379`

Worker:
- `QUEUE_MODE=bullmq`
- `REDIS_URL=redis://127.0.0.1:6379`
- `SEARCH_MODE=opensearch`
- `OPENSEARCH_URL=http://127.0.0.1:9200`
- `OPENSEARCH_INDEX=products`

Optional OpenSearch auth:
- `OPENSEARCH_API_KEY=...`
or
- `OPENSEARCH_USERNAME=...`
- `OPENSEARCH_PASSWORD=...`

Embeddings:
- `EMBEDDING_MODE=mock` (for smoke)
or
- `EMBEDDING_MODE=openai-compatible`
- `EMBEDDING_API_BASE_URL=...`
- `EMBEDDING_API_KEY=...`
- `EMBEDDING_MODEL=text-embedding-3-small` (optional)

## 3) Start Services

Run migration:
```bash
DATABASE_URL=postgres://user:pass@host:5432/dbname npm run db:migrate
```

Start API:
```bash
REPOSITORY_MODE=postgres \
QUEUE_MODE=bullmq \
REDIS_URL=redis://127.0.0.1:6379 \
DATABASE_URL=postgres://user:pass@host:5432/dbname \
npm run dev:api
```

Start worker:
```bash
API_BASE_URL=http://127.0.0.1:4000 \
QUEUE_MODE=bullmq \
REDIS_URL=redis://127.0.0.1:6379 \
SEARCH_MODE=opensearch \
OPENSEARCH_URL=http://127.0.0.1:9200 \
OPENSEARCH_INDEX=products \
EMBEDDING_MODE=mock \
npm run dev:worker
```

## 4) Run Automated Smoke Validation

In a separate shell:
```bash
API_BASE_URL=http://127.0.0.1:4000 \
OPENSEARCH_URL=http://127.0.0.1:9200 \
OPENSEARCH_INDEX=products \
SMOKE_WAIT_SECONDS=4 \
npm run validate:connected
```

Expected result:
- API health reports `repositoryMode=postgres` and `queueMode=bullmq`
- Product create succeeds
- OpenSearch doc lookup returns `200`
- Product delete succeeds
- OpenSearch doc lookup returns `404`

## 5) Troubleshooting

- If create succeeds but OpenSearch lookup fails:
  - Check worker logs for queue consumption errors.
  - Check Redis connectivity and `QUEUE_MODE` on both API and worker.
  - Check `SEARCH_MODE=opensearch` on worker.
- If OpenSearch auth fails:
  - Validate API key or basic auth env vars.
- If health endpoint shows wrong modes:
  - Validate API env vars before startup.
