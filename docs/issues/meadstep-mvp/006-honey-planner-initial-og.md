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
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Turn the planner into a real honey-only fermentation planner that estimates total honey from target ABV, caps automatic initial OG around 1.110, supports manual initial OG override, and presents initial honey, remaining honey, estimated stats, and gravity warnings.

## Acceptance criteria

- [ ] Auto mode caps initial OG around 1.110 and assigns excess honey to remaining step-feed honey.
- [ ] Manual mode treats the override as initial pitch OG and recalculates initial and remaining honey accordingly.
- [ ] Planner output includes initial OG, total equivalent OG, estimated ABV, initial honey, and remaining honey.
- [ ] High initial OG and high total equivalent OG warnings are plain and actionable.
- [ ] Tests cover auto cap, manual override, normal-gravity batches, high-gravity batches, and warning thresholds.

## Blocked by

- `003-honey-og-gravity-tool.md`
- `005-yeast-tolerance-warnings.md`
