---
title: Add simple standalone batch scaling tool
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 47
  - 48
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
- [ ] Tests cover scale factor calculation, optional quantities, validation, and rendered output.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`
