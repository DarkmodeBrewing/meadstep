---
title: Add standalone fruit sugar estimator
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 49
  - 50
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
- [ ] Tests cover fruit data, sugar estimate, gravity contribution, validation, and rendered UI behavior.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`
