---
title: Add honey OG and gravity conversion tool
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 40
  - 41
  - 42
  - 45
  - 59
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Add a standalone honey-to-OG tool with SG and Brix/Plato conversion support. The tool should use the canonical honey assumptions and expose enough context for users to understand that measured OG should win when precision matters.

## Acceptance criteria

- [ ] Users can enter honey amount and volume and see estimated OG, Brix/Plato, and ABV potential.
- [ ] Users can convert SG to Brix/Plato and Brix/Plato to SG in the standalone gravity tool.
- [ ] The shared package owns the honey and gravity formulas used by the UI.
- [ ] The UI includes the default honey assumption and a short note that honey varies.
- [ ] Tests cover honey gravity estimates, SG/Brix conversion in both directions, and representative UI behavior.

## Blocked by

- `001-core-package-planner-smoke.md`
- `002-unit-system-ui.md`
