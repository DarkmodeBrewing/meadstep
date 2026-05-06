---
title: Build initial honey planner with auto OG cap and manual override
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 7
  - 12
  - 13
  - 14
  - 15
  - 16
  - 30
  - 31
  - 32
  - 33
  - 34
  - 61
  - 65
  - 66
  - 68
  - 69
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Turn the planner into a real honey-only fermentation planner that estimates total honey from target ABV, caps automatic initial OG around 1.110, supports manual initial OG override, and presents initial honey, remaining honey, estimated stats, and gravity warnings. The planner should behave as a live worksheet, with default inputs visible and advanced controls kept behind a collapsible Advanced section.

## Acceptance criteria

- [ ] Auto mode caps initial OG around 1.110 and assigns excess honey to remaining step-feed honey.
- [ ] Manual mode treats the override as initial pitch OG and recalculates initial and remaining honey accordingly.
- [ ] Planner output includes initial OG, total equivalent OG, estimated ABV, initial honey, and remaining honey.
- [ ] High initial OG and high total equivalent OG warnings are plain and actionable.
- [ ] The planner route uses a facade that owns form state, calls `@meadstep/core`, maps results into Setup and Initial Must UI view models, and exposes validation state.
- [ ] Angular Signal Forms are used where practical for planner inputs; if the experimental API blocks implementation, the fallback signal-state approach is documented in the issue comments.
- [ ] Batch volume, target ABV, unit system, and yeast are visible in the default Setup section.
- [ ] Manual initial OG override is hidden behind the Advanced section and clearly described as initial pitch OG.
- [ ] Initial OG and total equivalent OG warnings are registered through the notice summary service and rendered inline near Initial Must plus in the active worksheet summary.
- [ ] Faulty planner fields show an error border and a small message below the field; dependent results show a neutral "enter valid values" state.
- [ ] Tests cover auto cap, manual override, normal-gravity batches, high-gravity batches, warning thresholds, facade/view-model behavior, validation states, and rendered worksheet behavior.

## Blocked by

- `003-honey-og-gravity-tool.md`
- `005-yeast-tolerance-warnings.md`
