# Issue Tracker: Local Markdown

Issues and PRDs for this repo live as markdown files in the repository, not in GitHub Issues.

## Locations

- PRDs live under `docs/prds/`.
- Implementation issues live under `docs/issues/`.
- The current MeadStep MVP issue set lives under `docs/issues/meadstep-mvp/`.

## Conventions

- One feature or PRD may have a directory under `docs/issues/<feature-slug>/`.
- Issue files should be numbered in dependency order, for example `001-core-package-planner-smoke.md`.
- Issue files should include YAML frontmatter with at least:
  - `title`
  - `type`
  - `status`
  - `labels`
  - `user_stories`, when sourced from a PRD
- Triage state is recorded in frontmatter as `status: <triage-role>`.
- Labels are recorded in frontmatter under `labels`.
- Comments and follow-up notes may be appended to the issue file under a `## Comments` heading when needed.

## When a skill says "publish to the issue tracker"

Create or update markdown files under `docs/issues/`, using the feature-specific directory when one exists.

Do not create GitHub issues unless the user explicitly asks to switch this repo to GitHub Issues.

## When a skill says "publish a PRD"

Create or update a markdown file under `docs/prds/`.

## When a skill says "fetch the relevant ticket"

Read the referenced markdown file from `docs/issues/` or `docs/prds/`. The user will normally pass the path or issue number directly.
