# Business Design Document (BDD)
## Project: AI-Powered Digital Jewellery Catalogue Platform
## Version: 1.0 (Technology Finalization)
## Date: March 3, 2026
## Status: Approved for Skeleton Build

## 1. Executive Summary
This document finalizes the technology and system design for Phase 1 of the AI-powered digital jewellery catalogue platform. The platform is designed as a design discovery and lead generation system, not a transactional e-commerce site in Phase 1.

The selected stack prioritizes:
- SEO and high performance for catalog discovery
- Reliable lead capture and appointment workflows
- AI-powered recommendations and conversational assistance
- Scalable architecture from 10,000 to 100,000+ designs

## 2. Business Intent and Outcomes
### 2.1 Core Intent
Build a digital-first jewellery discovery platform that drives store visits and qualified enquiries.

### 2.2 Business Outcomes
- Increase digital visibility and organic traffic
- Improve high-intent lead generation via WhatsApp and bookings
- Improve user engagement through wishlist, sharing, and AI guidance
- Build a future-ready technology foundation for multi-store expansion

## 3. Phase 1 Scope
### 3.1 In Scope
- Large-scale design catalog with filters and search
- Wishlist and sharing
- WhatsApp enquiry flow
- Appointment booking
- AI conversational assistant
- AI recommendation and customization suggestions
- Admin catalog and lead management

### 3.2 Out of Scope
- Online payments
- Checkout/cart
- Delivery and logistics
- Order tracking
- Real-time stock deduction

## 4. Finalized Technology Stack
### 4.1 Frontend
- Framework: Next.js (App Router) with TypeScript
- Rendering: SSR + ISR for SEO and scalable page generation
- Styling/UI: Component-driven UI system with responsive design
- Media: Next Image optimization with CDN-backed delivery

### 4.2 Backend
- Runtime: Node.js
- API Framework: NestJS (modular monolith architecture)
- API Style: REST (GraphQL optional in future phase)
- Validation: Zod or class-validator based request validation

### 4.3 Data and Persistence
- Primary DB: PostgreSQL (system of record)
- Cache/Queue: Redis + BullMQ
- Search & Semantic Retrieval: OpenSearch (keyword + filter + vector hybrid)
- Object Storage: AWS S3
- CDN: AWS CloudFront

### 4.4 AI Layer
- LLM provider integration through abstraction service
- Embeddings pipeline for product metadata and design descriptions
- Retrieval orchestration using OpenSearch vector capabilities
- Prompt and version management for controlled iteration

### 4.5 Integrations
- WhatsApp: Twilio WhatsApp API (or Meta Cloud API in future optimization)
- Booking: Internal scheduling module with admin-facing dashboard

### 4.6 DevOps and Platform
- Containerization: Docker
- Hosting: Managed cloud services for DB/search/cache/storage
- CI/CD: GitHub Actions (build, test, deploy)
- Environments: Dev, Staging, Production with separate resources

## 5. Architecture Design
### 5.1 Architectural Pattern
Adopt a modular monolith for Phase 1 to accelerate delivery while maintaining clean domain boundaries. This avoids premature microservices complexity and enables selective extraction later.

### 5.2 Core Modules
- Catalog Module: products, categories, attributes, tags, image metadata
- Search Module: indexing, filtering, ranking, vector retrieval
- AI Module: chat orchestration, recommendation pipeline, customization suggestions
- Lead Module: WhatsApp enquiries, contact capture, funnel state
- Booking Module: slot management, appointment lifecycle
- Admin Module: product CRUD, lead tracking, analytics snapshots

### 5.3 Data Flow (High-Level)
1. Admin updates product data in PostgreSQL.
2. Background jobs push searchable records and embeddings to OpenSearch.
3. User searches or chats on the website.
4. API combines structured filters + vector search for relevant designs.
5. User raises enquiry/booking; lead is persisted in PostgreSQL and surfaced in admin.

## 6. Scalability Strategy
### 6.1 Performance Targets
- Page load target: under 3 seconds
- AI response target: under 5 seconds
- Catalog browsing latency optimized using cache and pre-rendering

### 6.2 Scale Phases
- Phase 1: Single deployable modular monolith
- Phase 2: Read replicas, worker autoscaling, index tuning
- Phase 3: Extract high-load domains (search/AI) into dedicated services if required

### 6.3 Scale Enablers
- ISR and caching on catalog pages
- Asynchronous background jobs for heavy AI/indexing operations
- Stateless API instances behind load balancer
- Search cluster scaling via shard and node strategy

## 7. Security and Compliance
- HTTPS everywhere
- Admin authentication and role-based authorization
- Secrets management via cloud secret store
- Rate limiting on AI and public lead endpoints
- Audit logging for admin actions
- Data backup and retention policy for PostgreSQL and object storage

## 8. SEO and Growth Readiness
- SEO-friendly routing and metadata
- Structured data schema for product listing pages
- Open Graph support for sharing
- Fast media delivery through CDN
- Analytics instrumentation for funnel tracking

## 9. Analytics and KPI Instrumentation
### 9.1 KPI Tracking
- Monthly visitors
- Search to detail-page click-through rate
- AI interaction rate
- Wishlist save rate
- WhatsApp enquiry count
- Appointment booking conversion
- Lead-to-store-visit conversion (tracked operationally)

### 9.2 Event Tracking Plan
- Product viewed
- Search performed
- Filter applied
- Wishlist added
- AI chat started/completed
- Enquiry submitted
- Appointment booked

## 10. Delivery Plan for Skeleton Build
### 10.1 Repo Layout
- `apps/web` (Next.js frontend)
- `apps/api` (NestJS API)
- `apps/worker` (BullMQ workers)
- `packages/shared` (types, contracts, utilities)

### 10.2 Sprint 1 Deliverables
- Authentication and admin shell
- Catalog CRUD with image upload flow
- Search API and listing page with filters
- WhatsApp enquiry endpoint and admin lead table
- Appointment booking basic flow
- Foundational AI chat endpoint with retrieval integration

## 11. Risks and Mitigations
- AI relevance quality risk
  - Mitigation: prompt testing, offline relevance scoring, feedback loop
- Catalog data inconsistency risk
  - Mitigation: strong admin validation and mandatory metadata
- Slow initial page performance risk
  - Mitigation: ISR strategy, CDN tuning, image optimization
- Integration reliability risk (WhatsApp/webhooks)
  - Mitigation: retries, queue-based processing, observability alerts

## 12. Final Decision Statement
The project will proceed with:
- Next.js + TypeScript (frontend)
- Node.js + NestJS (backend modular monolith)
- PostgreSQL (primary DB)
- OpenSearch (search + vector retrieval)
- Redis + BullMQ (queue and background processing)
- S3 + CloudFront (media storage and delivery)
- Twilio WhatsApp API (lead communication integration)

This stack is approved for immediate skeleton implementation and supports both rapid delivery and controlled scalability.
