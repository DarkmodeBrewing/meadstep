---
title: Add metric and US unit support end to end
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 4
  - 5
  - 6
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add metric and US unit modes that convert user input and displayed output at the application boundary while shared calculations remain internally metric. The planner should keep equivalent results when the user switches units.

## Acceptance criteria

- [ ] Users can choose metric or US units for planner inputs and outputs.
- [ ] Shared calculations continue to operate on canonical metric values internally.
- [ ] Switching units preserves the same underlying batch plan within expected rounding tolerance.
- [ ] Generated planner output uses the selected unit system for displayed quantities.
- [ ] Tests cover volume and weight conversions plus a planner result in both unit systems.

## Blocked by

- `001-core-package-planner-smoke.md`
