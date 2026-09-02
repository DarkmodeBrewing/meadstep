---
title: Add step feeding schedule with batch-size-aware feed caps
type: AFK
status: ready-for-human
labels:
  - ready-for-human
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

## Scope

### Included

- Split the remaining honey from the initial-must plan into equal step feeds.
- Calculate the ideal feed count with `ceil(remainingHoneyG / (50 * volumeL))`, capped at four generated feeds.
- Calculate each gravity trigger so adding its feed returns the must to the initial pitch OG:

```text
feedGravityPoints = (feedHoneyKg * 290) / volumeL
gravityMilestone = initialPitchOg - (feedGravityPoints / 1000)
```

- Use `Day 2`, `Day 4`, `Day 6`, and `Day 8` as secondary labels for feeds one through four.
- Tell the brewer to wait when the measured SG has not reached the milestone by the approximate day.
- Warn when four feeds force a feed above 50 g/L.
- Clamp a milestone below `1.000` to `1.000` and warn that the selected initial pitch OG cannot be restored within the four-feed limit.
- Render the schedule in the active worksheet and include it in the current plain-text plan output.

### Excluded

- Nutrient amounts, TOSNA timing, and the one-third sugar break; those belong to issue `008-tosna-sugar-break.md`.
- User-editable feed counts, feed amounts, or day cadence.
- Fermentation telemetry or automatic detection of a reached gravity milestone.

## Scheduling policy

Measured gravity is the release condition. Approximate days are reminders, not permission to feed early: when the day arrives before the target SG, the brewer waits.

## Acceptance criteria

- [x] Remaining honey is split into step feeds using a preferred maximum of 50 g/L.
- [x] Auto-generated schedules cap at four feeds.
- [x] Plans that would need more than four feeds to stay under 50 g/L include a clear warning.
- [x] Step-feed instructions use gravity milestones as primary timing and approximate day labels as secondary guidance.
- [x] The planner facade maps feed schedules into a Step Feeds UI view model with feed number, honey amount, gravity milestone, approximate day label, and any section notices.
- [x] Feed-cap warnings are registered through the notice summary service and rendered inline near Step Feeds plus in the active worksheet summary.
- [x] The Step Feeds section remains readable in the mobile one-column worksheet and in the desktop live-results column.
- [x] Tests cover zero feeds, one feed, multiple feeds, four-feed cap behavior, warning behavior when preferred feed size is exceeded, facade/view-model behavior, and rendered Step Feeds output.

## Blocked by

- `006-honey-planner-initial-og.md`

## Comments

- Scope confirmed for implementation on `feature/step-feeding-schedule`.
- The gravity trigger intentionally refills to pitch OG instead of using a fixed percentage drop, keeping the schedule tied to the actual size of each feed.
- The two-day cadence is deliberately secondary to measured SG.
- Implementation complete and ready for human review.
