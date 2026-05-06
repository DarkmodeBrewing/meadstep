---
title: Add standalone fruit sugar estimator
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 49
  - 50
  - 62
  - 63
  - 65
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add a standalone fruit sugar estimator for melomel planning. It should estimate sugar and gravity contribution from fruit type, fruit weight, and batch volume, while staying explicitly separate from the main honey-only planner.

## Acceptance criteria

- [ ] Users can choose a fruit type, enter fruit weight and batch volume, and see estimated sugar and gravity contribution.
- [ ] The UI clearly treats fruit sugar as a standalone estimator, not part of the main planner.
- [ ] The shared package owns the fruit sugar data and calculation behavior.
- [ ] Output uses the selected unit system.
- [ ] `/fruit` is a focused route-level worksheet using the shared shell, navigation, global preferences, field components, result components, and its own facade.
- [ ] The UI clearly labels fruit sugar as separate from the honey-only planner and does not offer to merge fruit results into the planner.
- [ ] The fruit route facade owns form state, calls `@meadstep/core`, maps output into UI view models, and exposes validation state.
- [ ] Invalid values show field-level error borders/messages and neutral invalid-result output.
- [ ] Tests cover fruit data, sugar estimate, gravity contribution, selected unit-system output, facade/view-model behavior, validation, and rendered routed UI behavior.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`
