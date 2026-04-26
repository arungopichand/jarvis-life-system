# JARVIS Angular App

Angular 20 frontend for the JARVIS Life System.

## Product Role
The frontend delivers an intelligent, calm, token-governed Life OS interface for:
- missions and execution flow
- finance discipline tracking
- focus and behavioral reinforcement
- communication and confidence prompts
- weekly review and continuity awareness

## Stack
- Angular 20
- TypeScript
- SCSS token-based design system
- Service worker support (PWA-ready build)

## Commands

Install:

```bash
npm install
```

Run dev server:

```bash
npm start
```

Build production:

```bash
npm run build
```

Design-system audit:

```bash
npm run design:audit
```

## Design Governance
- Global tokens and shared utilities live in `src/styles.scss`
- Shell/integration styling lives in `src/app/app.scss`
- `scripts/design-audit.mjs` warns on drift and fails on component-level hardcoded colors
- See `DESIGN_SYSTEM.md` for usage rules and examples

## Environment Configuration
- `src/environments/environment.ts` local development base URL
- `src/environments/environment.prod.ts` production API URL

Update production API endpoint before shipping.

## Architecture Snapshot
- `src/app/components` modular UI panels
- `src/app/services` API clients
- `src/app/models` shared contracts
- root `App` orchestrates state and cross-module behavior

## Next Frontend Milestones
1. module-level routing and lazy loading
2. state extraction from root component into facades/signals
3. component test coverage for critical interaction flows
4. backend-backed learning/communication module persistence

