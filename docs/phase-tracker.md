# Phase Tracker

## Overall Status
- Phase 0: Completed
- Phase 1: Completed
- Phase 2: Completed
- Phase 3: In Progress (persistence wired, queue/search pending)
- Phase 4: In Progress
- Phase 5: Not Started

## Phase 0 Deliverables
- Monorepo workspace created
- Base TypeScript config added
- Shared contracts package added
- Project docs and implementation roadmap added

## Phase 1 Deliverables (current)
- API bootstrap and route dispatching
- Modules implemented: health, catalog, lead, booking, ai
- In-memory stores for quick functional validation
- Shared request validation and standardized module-level errors

## Phase 2 Seed Work Completed
- Web app shell wired to catalog endpoint
- Baseline responsive styling and layout
- Product detail page wired to catalog-by-id endpoint
- Enquiry submission form wired to `POST /api/leads`
- Appointment booking form wired to `POST /api/bookings`

## Phase 3 Progress
- PostgreSQL migration baseline created
- Repository contracts defined
- OpenSearch integration stubs added
- Worker job stubs for indexing and embedding added
- API controllers wired through repository container (in-memory implementation)
- PostgreSQL repository implementations added for catalog/leads/bookings
- Migration runner added with root command `npm run db:migrate`
- Environment-based repository mode selection (`postgres` or `memory`)
- Admin write APIs added for catalog product create/patch/delete
- Catalog write APIs now trigger queue publishing for indexing/embedding/remove
- Queue layer replaced with BullMQ-ready producer/consumer implementation with memory fallback
- Worker jobs now call real integration adapters for catalog fetch, OpenSearch upsert/delete, and embedding generation
- Integration tests added for API queue publishing and worker pipeline in memory mode
- Connected-mode validation script and runbook added for `postgres + redis/bullmq + opensearch` flow
- Dockerized local stack added for idempotent developer setup (`web + api + worker + postgres + redis + opensearch`)

## Phase 4 Progress
- Added admin leads visibility page in web app (`/admin/leads`) connected to `GET /api/leads`
- Enabled first end-to-end workflow validation: browse -> product detail -> enquiry -> admin lead visibility

## Immediate Next Step
- Expand Phase 4 by adding appointment visibility/admin actions and lead lifecycle status transitions
