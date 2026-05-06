---
title: Add shared Markdown brew plan export
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 51
  - 52
  - 53
  - 57
  - 61
  - 68
  - 70
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Generate a practical Markdown brew plan from the same structured planner result used by the UI. Add copy and download actions that both use that exact shared Markdown string.

## Acceptance criteria

- [ ] The shared package generates Markdown from the planner result.
- [ ] The UI displays copy and download actions for the generated plan.
- [ ] Copy and download use the same generated Markdown string.
- [ ] Download creates a sanitized `.md` filename based on batch volume and target ABV.
- [ ] The planner facade exposes export UI state, including whether the current plan is valid, copy/download enabled state, filename, and Markdown preview content.
- [ ] Copy and download actions are visible once a valid plan exists.
- [ ] The full Markdown preview appears inside an expandable Export section by default on mobile; it may be visible by default in the desktop results column when space allows.
- [ ] Tests cover Markdown content, copy/download source consistency, export view-model behavior, disabled/invalid export states, and representative rendered UI behavior.

## Blocked by

- `008-tosna-sugar-break.md`
