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
  - 65
  - 66
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add curated yeast selection, custom yeast entry, and tolerance-margin warnings to the planner. Plans should still generate above listed tolerance, but severe warnings should include a tolerance-limited FG hint. Custom yeast entry belongs in the planner Advanced section, not a separate route.

## Acceptance criteria

- [ ] Users can choose from the MVP yeast list and see tolerance and nitrogen requirement reflected in the plan.
- [ ] Users can enter a custom yeast name, alcohol tolerance, and nitrogen requirement.
- [ ] The planner emits normal, moderate, high, and severe yeast tolerance warnings based on target ABV margin.
- [ ] Above-tolerance plans include a clearly labeled estimated tolerance-limited FG hint.
- [ ] Yeast tolerance notices are registered through the notice summary service and rendered both inline near yeast/planner results and in the active worksheet summary.
- [ ] Warning styling follows the shared notice model: blue info, green ok, yellow warning, red error, light outline, compact spacing, and a small severity icon.
- [ ] Custom yeast fields use inline validation with error borders and small field-level messages.
- [ ] The planner facade maps yeast/tolerance core results into UI view models rather than formatting warning text in the template.
- [ ] Tests cover curated yeast defaults, custom yeast validation, warning thresholds, tolerance-limited FG estimation, notice summary registration, facade/view-model behavior, and rendered warning states.

## Blocked by

- `001-core-package-planner-smoke.md`
- `004-abv-tool.md`
