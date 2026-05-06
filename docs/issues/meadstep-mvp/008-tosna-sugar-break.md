---
title: Add TOSNA Fermaid O schedule and 1/3 sugar break
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 24
  - 25
  - 26
  - 27
  - 28
  - 29
  - 46
  - 62
  - 65
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add TOSNA 2.0 / Fermaid O nutrient planning to the main planner and expose a standalone 1/3 sugar break calculator. Nutrient calculation should use initial must Brix and schedule additions at 24h, 48h, 72h, and 1/3 sugar break.

## Acceptance criteria

- [ ] Planner output includes total Fermaid O and four equal additions based on initial must Brix and yeast nitrogen requirement.
- [ ] Nutrient timing is 24h, 48h, 72h, and 1/3 sugar break.
- [ ] Planner output includes short yeast rehydration guidance without calculating Go-Ferm dosage.
- [ ] Standalone sugar break tool calculates 1/3 sugar break from starting OG or Brix.
- [ ] The planner facade maps nutrient data into a Nutrients UI view model with total Fermaid O, per-addition amounts, timing labels, 1/3 sugar break, and rehydration guidance.
- [ ] `/sugar-break` is a focused route-level worksheet using the shared shell, navigation, preferences, field components, result components, and its own facade.
- [ ] Sugar break validation uses inline field errors and neutral invalid-result states.
- [ ] Tests cover TOSNA factors, total Fermaid O, per-addition split, 1/3 sugar break, planner nutrient view models, sugar-break facade behavior, validation states, and displayed planner/tool schedules.

## Blocked by

- `005-yeast-tolerance-warnings.md`
- `007-step-feeding-schedule.md`
