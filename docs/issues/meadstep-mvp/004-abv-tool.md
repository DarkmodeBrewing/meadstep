---
title: Add classic and reverse ABV calculator
type: AFK
status: ready-for-human
labels:
  - ready-for-human
user_stories:
  - 43
  - 44
  - 62
  - 65
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add a standalone ABV calculator that supports classic OG + FG to ABV and reverse OG + target ABV to estimated FG. This gives users a small, complete calculator before the full planner needs every warning and schedule.

## Acceptance criteria

- [x] Users can calculate ABV from OG and FG.
- [x] Users can estimate FG from OG and target ABV.
- [x] The calculator validates gravity and ABV ranges and presents plain error states.
- [x] The shared package owns both ABV formulas.
- [x] `/abv` is a focused route-level worksheet using the shared shell, navigation, preferences, field components, and result components.
- [x] The ABV route uses a facade that owns form state, calls `@meadstep/core`, maps results into UI view models, and exposes validation state.
- [x] Invalid fields show an error border and a small field-level message; invalid dependent output shows a neutral "enter valid values" state.
- [x] Tests cover classic ABV, reverse FG estimation, invalid inputs, facade/view-model behavior, and rendered routed UI output.

## Blocked by

- `001-core-package-planner-smoke.md`

## Comments

Implemented on `feature/abv-calculator`. Core schemas constrain calculator gravity to 0.900–1.300 and target/calculated ABV to 0–30%; the route facade maps those domain rules to field-level messages and a neutral dependent-output state.
