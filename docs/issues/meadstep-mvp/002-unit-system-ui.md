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

- [x] Users can choose metric or US units for planner inputs and outputs.
- [x] Shared calculations continue to operate on canonical metric values internally.
- [x] Switching units preserves the same underlying batch plan within expected rounding tolerance.
- [x] Generated planner output uses the selected unit system for displayed quantities.
- [x] Tests cover volume and weight conversions plus a planner result in both unit systems.

## Blocked by

- `001-core-package-planner-smoke.md`

## Comments

- Implemented after `001`. The current UI supports metric/US planner input and output switching, preserves the underlying batch plan through boundary conversions, and verifies unit behavior in frontend/core tests.
