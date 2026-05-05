---
title: Create shared core package and planner smoke path
type: AFK
status: needs-triage
labels:
  - needs-triage
user_stories:
  - 1
  - 3
  - 54
  - 55
  - 56
  - 58
---

## Parent

`docs/prds/meadstep-mvp-prd.md`

## What to build

Create the shared MeadStep domain package and wire the frontend to a minimal planner result from it. The first slice should prove the app can call shared, pure, validated calculation logic and render a simple planner result without depending on backend-only formulas.

## Acceptance criteria

- [ ] A shared TypeScript package exists for MeadStep domain logic and can be imported by the frontend workspace.
- [ ] The shared package exposes validated planner input and result shapes for a minimal honey-only plan.
- [ ] The frontend default screen calls the shared package and renders a demoable planner result from editable batch volume and target ABV inputs.
- [ ] Tests cover the shared planner smoke behavior through public package APIs.
- [ ] The backend remains functional and does not become the source of formula truth.

## Blocked by

None - can start immediately.
