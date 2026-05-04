# AGENTS.md

Guidance for agents working in this repository.

## Project

This repository is for **MeadStep** (working name), a free, mobile-first web toolbox for mead makers. The first product goal is to generate a complete, actionable fermentation plan from minimal inputs:

- Honey additions, including initial and step-feeding amounts.
- TOSNA / Fermaid O nutrient schedule.
- Estimated OG, FG range, and ABV.
- Practical warnings for yeast tolerance, high OG stress, and nutrient requirements.
- Copyable markdown/text brew plan output.

Read the docs before making product or calculation decisions:

- `docs/tool-spec.md` is the source of truth for MVP scope and product direction.
- `docs/notes.md` contains rough calculation notes and legacy/reference formulas. Treat these as research material, not final implementation requirements unless the spec or user confirms them.

## Technical Direction

Follow the direction in `docs/tool-spec.md` unless the user changes it:

- Use TypeScript.
- Use Zod for runtime typing and validation.
- Keep formatting tight with Prettier.
- Use a monorepo structure.
- Frontend should use the latest Angular with signals for reactive calculations.
- Calculation logic should be pure, deterministic, and covered by focused tests.
- Markdown/text output should be generated from the same calculation result used by the UI.
- Keep the app local-first; persistence can be added later.
- Avoid external runtime dependencies for core calculations unless there is a strong reason and the user approves.

## UX Direction

The MVP should be mobile-first and usable mid-brew:

- Recalculate instantly as inputs change; do not require a submit button.
- Prefer minimal inputs and opinionated defaults.
- Present output as practical brewing instructions, not academic derivations.
- Make the brew plan easy to copy.
- Keep warnings plain and actionable.

## Git

When committing in this repository, always use:

```bash
git config user.name DarkmodeBrewing
git config user.email developer@darkmode.tools
```

Repository-local Git config has been set this way, but verify before committing if the environment changes.

## Calculation Standards

For formulas and brewing assumptions:

- Prefer named, documented pure functions.
- Add tests for unit conversions, gravity conversions, ABV estimates, honey calculations, nutrient splits, and warning thresholds.
- Keep source references or rationale near calculation tests or docs when a formula is non-obvious.
- Do not silently change brewing assumptions; if a formula or threshold is uncertain, ask the user.

Known calculations from the current docs include:

- Brix/Plato to SG and SG to Brix/Plato conversions.
- OG to ABV calculation.
- Honey quantity planning.
- Step feeding schedule generation.
- TOSNA nutrient total and split schedule.
- Potential future blending, backsweetening, Delle/stabilization, and batch tracking tools.

## Working Rules

- Keep changes tightly scoped to the requested tool or calculation.
- Do not introduce broad architecture before the first concrete MVP workflow needs it.
- Do not overwrite user changes.
- If docs and code disagree, pause and ask the user which should win.
- If a brewing formula affects user-facing recommendations and is not clearly specified, ask the user rather than guessing.
