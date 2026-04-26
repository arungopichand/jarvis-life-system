# Jarvis Angular Design System

## Purpose
This document defines how UI styling should be built and reviewed in the Jarvis Angular app so the interface remains calm, focused, and consistent as features grow.

## Design Philosophy
- Calm-first workspace: dark neutral surfaces reduce fatigue.
- Intentional attention: accent is reserved for action/focus/progress, not decoration.
- Semantic consistency: status and interaction states are mapped to function, not taste.
- Composable primitives: prefer reusable panel/card/chip/button utilities over bespoke component styling.

## Color Psychology
- Calm base: deep blue-neutral surfaces (`--color-bg-*`, `--color-surface-*`).
- Focus: restrained cyan (`--color-accent-500`, `--a`) for interaction and emphasis.
- Success/reward: controlled green (`--color-success-500`, `--s`) for completion and positive feedback.
- Warning: muted amber (`--color-warning-500`, `--h` / `--w`) for caution and pacing.
- Danger: sharp red (`--color-danger-500`, `--d`) for destructive/error states.
- Info: clear blue (`--color-info-500`, `--i`) for neutral notices.

## Token Categories
- Core color tokens: `--color-*`
- Compact RGB channels: `--a`, `--h`, `--s`, `--w`, `--d`, `--i`
- Surface/elevation: `--elev-*`, `--panel-bg-*`, `--card-bg*`, `--surface-*`
- Borders/shadows/glow: `--color-border-*`, `--shadow-*`, `--glow-*`
- Interaction: `--state-*`, `--focus-*`, `--motion-*`, `--transition-interactive`
- Gradients/accents: `--gradient-*`, `--line-accent-*`

## Elevation Rules
- App background only: `--elev-0` / `--color-bg-canvas`
- Section containers: `ui-panel` or `--panel-bg-calm`
- Interactive/info containers: `ui-card`
- Inset content (inner blocks): `ui-card--inset` / `--color-surface-inset`
- Focus card variant: `ui-card--focus`
- Success card variant: `ui-card--success`

## Accent Usage Rules
Use accent (cyan/amber glow/lines) only for:
- Primary actions (`ui-btn--primary`, `.finance-button`, `.complete-button`)
- Focus state and keyboard focus ring
- Progress/reward indicators (`success`, XP, completion moments)
- Important section accents (single eyebrow or accent line)

Avoid accent for:
- Body text
- Generic card backgrounds
- Non-interactive metadata chips

## Status Color Rules
- Info: `ui-chip--info` or info-message pattern
- Success: `ui-chip--success` or success-message pattern
- Warning: `ui-chip--warning`
- Danger: `ui-chip--danger` or error-message pattern

Do not invent new status shades in component files.

## Primitive Usage
- Panels: `ui-panel`, `ui-panel--hero`
- Cards: `ui-card`, `ui-card--inset`, `ui-card--focus`, `ui-card--success`
- Chips: `ui-chip` + status modifier
- Buttons: `ui-btn` + variant (`--primary`, `--secondary`, `--danger`)
- Accent divider line: `ui-accent-line`
- Muted text: `ui-text-muted`

## Interaction Rules
- Focus rings: use shared `:focus-visible` tokenized outline.
- Hover/active/disabled: use `--transition-interactive` and global disabled behavior.
- Keep motion subtle; avoid long or bouncing transitions for core workflow actions.

## Accessibility Rules
- Maintain clear text/surface contrast in both dark and light modes.
- Ensure focus is visible on all keyboard-accessible controls.
- Prefer semantic status utilities to preserve contrast and consistency.

## Do / Don’t
### Do
- Use tokens and utility primitives first.
- Reuse existing panel/card/button/chip classes in templates.
- Centralize new visual decisions in `src/styles.scss`.

### Don’t
- Hardcode new hex colors or raw `rgba(...)` in component styles for reusable UI patterns.
- Copy-paste box-shadow or gradient stacks between components.
- Introduce one-off state colors outside the semantic status system.

## Review Checklist
- Does the component use shared primitives?
- Are all colors/shadows/gradients tokenized?
- Is accent used only where functionally justified?
- Are focus/disabled states consistent?
- Does it still read clearly in dark and light modes?
