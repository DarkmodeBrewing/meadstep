# MeadStep MVP Local Issues

Local issue set generated from `docs/prds/meadstep-mvp-prd.md`.

These issues are intentionally stored in the repo instead of GitHub. Treat `status: needs-triage` as the local equivalent of the triage label.

## Breakdown

1. `001-core-package-planner-smoke.md` - shared package foundation and first planner smoke path.
2. `002-unit-system-ui.md` - metric and US unit support end to end. Implemented.
3. `003-honey-og-gravity-tool.md` - honey OG and gravity conversion tool, plus the initial route shell, feature-first structure, preferences, notice model, and shared UI primitives needed before more tools are added. Implemented.
4. `004-abv-tool.md` - classic and reverse ABV tool. Implemented.
5. `005-yeast-tolerance-warnings.md` - curated/custom yeast and tolerance warnings. Implemented.
6. `006-honey-planner-initial-og.md` - initial honey plan with auto cap and manual override.
7. `007-step-feeding-schedule.md` - step-feed count, feed caps, and milestones.
8. `008-tosna-sugar-break.md` - TOSNA / Fermaid O and 1/3 sugar break.
9. `009-markdown-export.md` - copy and download Markdown brew plan.
10. `010-batch-scaling-tool.md` - simple standalone batch scaling.
11. `011-fruit-sugar-tool.md` - standalone fruit sugar estimator.
12. `012-mobile-toolbox-polish.md` - mobile-first navigation and full workflow polish.

## Dependency Order

```text
001
  -> 002
  -> 003
  -> 004
  -> 005
  -> 006 -> 007 -> 008 -> 009 -> 012
  -> 010
  -> 011
```

Issues `001` through `005` have been implemented. Remaining slices are marked AFK because the PRD and decision log resolve the major product, formula, UI, and Angular architecture decisions for MVP.
