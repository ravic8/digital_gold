# Implementation Phases

## Phase 0: Foundation (current)
- Monorepo setup and folder structure
- Baseline TypeScript config and lint/format placeholders
- Shared package contracts starter
- Developer docs and runbook starter

## Phase 1: Backend Module Skeleton
- API bootstrap and route registration
- Modules: `catalog`, `lead`, `booking`, `ai`, `health`
- Request/response contracts via `packages/shared`
- In-memory repositories for local flow testing

## Phase 2: Frontend Skeleton
- Next.js scaffold with catalog listing shell
- Product detail shell
- Enquiry + appointment form shells
- API client wiring to Phase 1 endpoints

## Phase 3: Data and Search Integration
- PostgreSQL schema and migration baseline
- OpenSearch indexing pipeline skeleton
- Redis/BullMQ worker pipeline skeleton
- Repository interfaces connected to infra adapters

## Phase 4: End-to-End Flow
- Browse catalog -> submit enquiry -> view in admin
- Book appointment -> admin status updates
- AI recommendation endpoint integrated with retrieval stub

## Phase 5: Hardening and Launch Readiness
- Authentication/authorization for admin
- Validation, rate limiting, audit logs
- Observability (logs, traces, metrics)
- CI pipeline, tests, and release checklist
