---
title: Add honey OG and gravity conversion tool
type: AFK
status: ready-for-human
labels:
  - ready-for-human
user_stories:
  - 40
  - 41
  - 42
  - 45
  - 59
  - 62
  - 63
  - 64
  - 65
  - 67
  - 68
  - 69
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add a standalone honey-to-OG tool with SG and Brix/Plato conversion support. The tool should use the canonical honey assumptions and expose enough context for users to understand that measured OG should win when precision matters.

Before or as part of this slice, establish the Angular UI architecture that later tools will reuse: route-based navigation, a thin app shell, feature-first folders, shared preference services, shared notice models, facade-backed route screens, and small custom design-system primitives.

## Acceptance criteria

- [x] Users can enter honey amount and volume and see estimated OG, Brix/Plato, and ABV potential.
- [x] Users can convert SG to Brix/Plato and Brix/Plato to SG in the standalone gravity tool.
- [x] The shared package owns the honey and gravity formulas used by the UI.
- [x] The UI includes the default honey assumption and a short note that honey varies.
- [x] `/` redirects to `/planner`, and `/honey-og` and `/gravity` are route-level screens reachable from compact tool navigation.
- [x] `App` is reduced to a shell that composes the header, tool navigation, and router outlet rather than owning planner/tool field logic.
- [x] The frontend has feature-first structure with shell, shared UI, shared preferences, shared notices, planner feature, and standalone tool feature folders.
- [x] A global preferences service stores unit and theme preference in `localStorage`; theme supports `system`, `light`, and `dark` and follows OS preference when set to `system`.
- [x] A reusable notice model and notice summary service exists for feature facades to publish inline notices and route-level summaries.
- [x] The honey/gravity route uses a facade that owns form state, calls `@meadstep/core`, maps results into UI view models, and exposes validation state.
- [x] Angular Signal Forms are used where practical for this route's form state; if the experimental API blocks implementation, the fallback signal-state approach is documented in the issue comments.
- [x] Shared dumb field/result/notice components render labels, unit suffixes, helper text, errors, and value changes without owning MeadStep formulas.
- [x] Inline validation gives faulty fields an error border and a small message below the field while unrelated sections remain usable.
- [x] Tests cover honey gravity estimates, SG/Brix conversion in both directions, facade/view-model behavior, preference behavior, validation states, and representative routed UI behavior.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`

## Comments

Implementation status: ready for human review.

Implemented in:

- `7d91d9b` Add honey gravity and conversion formulas to core
- `0530ade` Build routed Angular tool foundation

Notes:

- The frontend uses Angular signals and facade-owned signal state for the Honey OG and Gravity tool forms. Angular Signal Forms were not adopted in this slice because the current implementation did not need the experimental forms API to satisfy the workflow and validation requirements.
- Verified with `corepack pnpm format:check`, `corepack pnpm -r test`, and `corepack pnpm -r build`.
