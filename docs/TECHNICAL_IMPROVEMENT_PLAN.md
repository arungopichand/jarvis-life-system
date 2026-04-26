# Technical Improvement Plan

This plan translates JARVIS from MVP into a robust, showcase-ready architecture while preserving readability for a solo builder.

## Current Strengths
- Clear backend API surface with focused controller endpoints
- Practical EF Core persistence and simple onboarding
- Modular Angular UI with broad domain coverage
- Strong visual design governance (tokens, utilities, audit script)
- Good product instinct around discipline, focus, and behavior loops

## Current Weaknesses
- Minimal backend layering (controllers tightly coupled to DbContext)
- Limited request validation and contract boundaries (recently improved)
- No automated tests for backend or frontend
- No migration workflow (`EnsureCreated` bootstrap strategy)
- Root docs were previously MVP-level and not showcase-grade
- Local UI state is concentrated in root `App` component

## Backend Architecture Direction

### Target structure
- `Controllers`: thin HTTP boundary
- `Contracts`: request/response DTOs
- `Application/Services`: use-case logic and orchestration
- `Domain`: entities + future domain rules/value objects
- `Data/Infrastructure`: EF Core + adapters

### Introduced in this pass
- Global exception middleware with consistent `ProblemDetails` responses
- Write DTOs with validation attributes for key endpoints
- New service layer example: `LifeOsInsightsService`
- New endpoint: `GET /api/insights/today`

### Next backend milestones
1. Replace `EnsureCreated` with EF Core migrations workflow
2. Add FluentValidation or extended DataAnnotations + custom validation filters
3. Move streak/weekly calculations behind dedicated application services
4. Add unit tests for score/streak/insight calculations
5. Add integration tests for critical API paths

## Frontend Architecture Direction

### Target structure
- `components`: presentational and container modules
- `services`: API/data access boundary
- `models`: shared contracts
- future: `state` layer (signals/store) for cross-module orchestration

### Introduced in recent passes
- Token-governed UI and utility primitives
- Design audit script for drift prevention
- Behavioral reinforcement and session continuity layer in app state

### Next frontend milestones
1. Extract orchestration from `App` into domain-oriented facade/state services
2. Add module-level routing/tabs for clearer information architecture
3. Add persisted module data for learning/communication/identity
4. Add component tests for critical interaction modules

## Product/Data Model Expansion (Planned)
- Learning module entities: `LearningMission`, `ConceptReview`, `ProjectIdea`
- Communication entities: `VocabularyEntry`, `SpeakingSession`, `ScenarioPractice`
- Identity/confidence entities: `IdentitySignal`, `ConfidenceRep`, `ProofLog`
- Monthly analytics entities: `MonthlyReviewSnapshot`, `BehaviorTrend`

## DX and GitHub Showcase Upgrades
1. Root README with architecture and execution story
2. Explicit quick-start + validation commands
3. Product blueprint docs with module-level API/entity planning
4. Screenshot placeholders and roadmap sections
5. Future CI pipeline for build + lint + tests + design audit

## Risk Watchlist
- Style budget limits (`anyComponentStyle`) can block large inline style additions
- Growing root component complexity may slow feature velocity
- Without tests, behavior/regression risk increases as modules grow
- `EnsureCreated` can cause schema lifecycle issues in long-lived environments

## Recommended 30-Day Execution Sequence
1. Week 1: migrations, validation cleanup, API contract hardening
2. Week 2: learning + communication backend models + APIs
3. Week 3: frontend routing/state extraction + module wiring
4. Week 4: tests + CI + README screenshots + release-style documentation

