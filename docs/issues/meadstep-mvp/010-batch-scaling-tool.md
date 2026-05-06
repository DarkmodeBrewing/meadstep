---
title: Add simple standalone batch scaling tool
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 47
  - 48
  - 62
  - 63
  - 65
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add a standalone batch scaling tool that proportionally scales honey and optional additions from an original volume to a target volume. Keep it intentionally simple and separate from recipe persistence.

## Acceptance criteria

- [ ] Users can enter original volume and target volume and see the scale factor.
- [ ] Users can scale honey amount.
- [ ] Users can optionally scale nutrient and fruit amounts.
- [ ] Output uses the selected unit system.
- [ ] `/scale` is a focused route-level worksheet using the shared shell, navigation, global preferences, field components, result components, and its own facade.
- [ ] The scale route facade owns form state, calls `@meadstep/core`, maps output into UI view models, and exposes validation state.
- [ ] Invalid values show field-level error borders/messages and neutral invalid-result output.
- [ ] Tests cover scale factor calculation, optional quantities, selected unit-system output, facade/view-model behavior, validation, and rendered routed output.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`
