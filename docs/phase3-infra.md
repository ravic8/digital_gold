# Phase 3 Infrastructure Baseline

## Added in this phase slice
- PostgreSQL migration baseline: `apps/api/src/infra/postgres/migrations/0001_init.sql`
- Product seed migration: `apps/api/src/infra/postgres/migrations/0002_seed_products.sql`
- Repository contracts: `apps/api/src/infra/repositories/types.ts`
- OpenSearch integration stubs: `apps/api/src/infra/search/opensearch.client.ts`
- Worker job stubs for indexing and embeddings:
  - `apps/worker/src/jobs/index-product.job.ts`
  - `apps/worker/src/jobs/generate-embedding.job.ts`
- PostgreSQL repositories:
  - `apps/api/src/infra/repositories/postgres/catalog.repository.ts`
  - `apps/api/src/infra/repositories/postgres/lead.repository.ts`
  - `apps/api/src/infra/repositories/postgres/booking.repository.ts`
- Migration runner:
  - `apps/api/src/infra/postgres/migrate.ts`
  - `apps/api/src/scripts/migrate.ts`
- Repository mode switch (`postgres` or `memory`) in:
  - `apps/api/src/infra/repositories/container.ts`
- Admin product write endpoints:
  - `POST /api/admin/catalog/products`
  - `PATCH /api/admin/catalog/products/:id`
  - `DELETE /api/admin/catalog/products/:id`
- Queue publishing integrated via BullMQ-ready producer:
  - `apps/api/src/infra/queue/publisher.ts`
- BullMQ-ready worker consumers:
  - `apps/worker/src/lib/queue.ts`
  - `apps/worker/src/jobs/remove-product-index.job.ts`
  - `apps/worker/src/main.ts`
- Worker integration adapters:
  - Catalog API fetch client: `apps/worker/src/infra/http/catalog-api.client.ts`
  - OpenSearch client: `apps/worker/src/infra/search/opensearch.client.ts`
  - Embedding provider client: `apps/worker/src/infra/ai/embedding.client.ts`
- Integration tests:
  - API queue publisher tests: `apps/api/src/infra/queue/publisher.test.ts`
  - Worker pipeline tests: `apps/worker/src/pipeline.test.ts`

## Next implementation tasks
- Install queue dependencies in environments where missing (`bullmq`, `ioredis`)
- Add integration tests for repository mode (`memory` and `postgres`)
- Complete Redis/BullMQ + OpenSearch end-to-end runtime validation in a connected environment
