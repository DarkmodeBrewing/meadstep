---
title: Add yeast selection, custom yeast, and tolerance warnings
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 8
  - 9
  - 10
  - 11
  - 35
  - 36
  - 37
  - 38
  - 39
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add curated yeast selection, custom yeast entry, and tolerance-margin warnings to the planner. Plans should still generate above listed tolerance, but severe warnings should include a tolerance-limited FG hint.

## Acceptance criteria

- [ ] Users can choose from the MVP yeast list and see tolerance and nitrogen requirement reflected in the plan.
- [ ] Users can enter a custom yeast name, alcohol tolerance, and nitrogen requirement.
- [ ] The planner emits normal, moderate, high, and severe yeast tolerance warnings based on target ABV margin.
- [ ] Above-tolerance plans include a clearly labeled estimated tolerance-limited FG hint.
- [ ] Tests cover curated yeast defaults, custom yeast validation, warning thresholds, and tolerance-limited FG estimation.

## Blocked by

- `001-core-package-planner-smoke.md`
- `004-abv-tool.md`
