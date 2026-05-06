---
title: Polish mobile-first toolbox navigation and complete MVP workflow
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 1
  - 2
  - 39
  - 60
  - 61
  - 62
  - 63
  - 64
  - 65
  - 66
  - 67
  - 68
  - 69
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Polish the full MVP as a mobile-first live brew-planning worksheet with the planner as the default first screen and compact route navigation to standalone tools. Verify that the complete planner workflow is readable, actionable, follows the agreed Angular architecture, and works without recipe saving.

## Acceptance criteria

- [ ] Planner is the first/default screen.
- [ ] `/` redirects to `/planner`, and compact route navigation exposes Planner, Honey OG, ABV, Gravity, Sugar Break, Scale, and Fruit tools.
- [ ] `App` remains a thin shell; planner and tool fields/results are not implemented directly in `app.ts` or `app.html`.
- [ ] The frontend follows the feature-first structure documented in the PRD and decision log.
- [ ] Route-level screens use facades for form state, core calls, validation, UI view models, notice registration, and export state.
- [ ] Shared UI components remain dumb/presentational and mostly form-library-agnostic, with optional thin adapters for Angular Signal Forms.
- [ ] Inputs recalculate instantly without a submit button across the core planner workflow.
- [ ] The planner reads as one continuous worksheet on mobile: Setup, Initial Must, Step Feeds, Nutrients, Warnings, and Export.
- [ ] Tablet/desktop planner layout uses a sticky input column with live results beside it.
- [ ] Standalone tools use the same focused worksheet pattern: inputs, primary result, secondary details/conversions, and short assumption notes.
- [ ] The compact app header contains MeadStep, unit toggle, and theme toggle without marketing or hero content.
- [ ] Unit and theme preferences are global, persisted to `localStorage`, and shared across routes.
- [ ] Theme supports `system`, `light`, and `dark`; `system` follows OS color-scheme preference.
- [ ] The custom design system supports light/dark tokens, restrained borders, compact controls, practical result blocks, and sparing honey/amber accents.
- [ ] Warnings are plain, actionable, noticeable but not intrusive, and do not crowd out the brew plan on mobile.
- [ ] Notice styling follows severity conventions: blue info, green ok, yellow warning, red error, light outline, compact spacing, and small severity icons.
- [ ] Inline validation uses field-level error borders and small messages below faulty fields.
- [ ] The Markdown export section keeps copy/download visible for valid plans and keeps the full preview expandable by default on mobile.
- [ ] A final frontend test or smoke path verifies the full planner workflow, export actions, standalone tool navigation, preferences, validation states, and notice summary behavior.

## Blocked by

- `009-markdown-export.md`
- `010-batch-scaling-tool.md`
- `011-fruit-sugar-tool.md`
