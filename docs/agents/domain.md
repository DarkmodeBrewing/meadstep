# Domain Docs

How engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This is a single-context repo. MeadStep has one product domain even though implementation is split across frontend, backend, and shared packages.

## Before Exploring, Read These

- `docs/tool-spec.md` for MVP scope and product direction.
- `docs/DECISIONS.md` for implementation-facing decisions that resolve ambiguity.
- Relevant PRDs under `docs/prds/`.
- Relevant local issues under `docs/issues/`.
- Formula notes under `docs/formulas/`.
- `docs/YEAST.md` for yeast data direction.
- `docs/notes.md` as rough research material only, not final implementation requirements.
- ADRs under `docs/adr/` if that directory exists.

If one of these files or directories does not exist, proceed silently.

## Vocabulary

Use the project's established brewing vocabulary:

- MeadStep
- mead planner
- honey plan
- initial OG
- total equivalent OG
- step feeding
- TOSNA 2.0
- Fermaid O
- 1/3 sugar break
- yeast tolerance
- nitrogen requirement
- tolerance-limited FG
- copyable Markdown brew plan

Avoid replacing these terms with loose synonyms when naming issues, tests, modules, or user-facing behavior.

## Decision Conflicts

Treat `docs/DECISIONS.md` as the source of truth when it conflicts with older planning notes.

If implementation would contradict an existing decision, pause and surface the conflict before changing the assumption.
