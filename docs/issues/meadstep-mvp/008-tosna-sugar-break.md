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
- [ ] Tests cover TOSNA factors, total Fermaid O, per-addition split, 1/3 sugar break, and displayed planner schedule.

## Blocked by

- `005-yeast-tolerance-warnings.md`
- `007-step-feeding-schedule.md`
