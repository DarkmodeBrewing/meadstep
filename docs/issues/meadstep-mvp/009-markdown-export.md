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
- [ ] Tests cover Markdown content, copy/download source consistency, and representative UI behavior.

## Blocked by

- `008-tosna-sugar-break.md`
