---
title: Add classic and reverse ABV calculator
type: AFK
status: needs-triage
labels:
  - needs-triage
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

- [ ] Users can calculate ABV from OG and FG.
- [ ] Users can estimate FG from OG and target ABV.
- [ ] The calculator validates gravity and ABV ranges and presents plain error states.
- [ ] The shared package owns both ABV formulas.
- [ ] `/abv` is a focused route-level worksheet using the shared shell, navigation, preferences, field components, and result components.
- [ ] The ABV route uses a facade that owns form state, calls `@meadstep/core`, maps results into UI view models, and exposes validation state.
- [ ] Invalid fields show an error border and a small field-level message; invalid dependent output shows a neutral "enter valid values" state.
- [ ] Tests cover classic ABV, reverse FG estimation, invalid inputs, facade/view-model behavior, and rendered routed UI output.

## Blocked by

- `001-core-package-planner-smoke.md`
