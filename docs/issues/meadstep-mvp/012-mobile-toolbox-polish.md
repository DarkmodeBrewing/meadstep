---
title: Polish mobile-first toolbox navigation and complete MVP workflow
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 1
  - 2
  - 39
  - 60
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Polish the full MVP as a mobile-first toolbox with the planner as the default first screen and compact navigation to standalone tools. Verify that the complete planner workflow is readable, actionable, and works without recipe saving.

## Acceptance criteria

- [ ] Planner is the first/default screen.
- [ ] Compact navigation exposes Planner, Honey OG, ABV, Gravity, Sugar Break, Scale, and Fruit tools.
- [ ] Inputs recalculate instantly without a submit button across the core planner workflow.
- [ ] Warnings are plain, actionable, and do not crowd out the brew plan on mobile.
- [ ] A final frontend test or smoke path verifies the full planner workflow, export actions, and standalone tool navigation.

## Blocked by

- `009-markdown-export.md`
- `010-batch-scaling-tool.md`
- `011-fruit-sugar-tool.md`
