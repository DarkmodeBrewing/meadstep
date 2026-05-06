---
title: Add step feeding schedule with batch-size-aware feed caps
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 17
  - 18
  - 19
  - 20
  - 21
  - 22
  - 23
  - 61
  - 66
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Convert remaining honey into a practical step-feeding schedule. Feed count should be based on the preferred 50 g/L maximum, auto plans should cap at four feeds, and instructions should lead with gravity milestones while keeping approximate days visible.

## Acceptance criteria

- [ ] Remaining honey is split into step feeds using a preferred maximum of 50 g/L.
- [ ] Auto-generated schedules cap at four feeds.
- [ ] Plans that would need more than four feeds to stay under 50 g/L include a clear warning.
- [ ] Step-feed instructions use gravity milestones as primary timing and approximate day labels as secondary guidance.
- [ ] The planner facade maps feed schedules into a Step Feeds UI view model with feed number, honey amount, gravity milestone, approximate day label, and any section notices.
- [ ] Feed-cap warnings are registered through the notice summary service and rendered inline near Step Feeds plus in the active worksheet summary.
- [ ] The Step Feeds section remains readable in the mobile one-column worksheet and in the desktop live-results column.
- [ ] Tests cover zero feeds, one feed, multiple feeds, four-feed cap behavior, warning behavior when preferred feed size is exceeded, facade/view-model behavior, and rendered Step Feeds output.

## Blocked by

- `006-honey-planner-initial-og.md`
