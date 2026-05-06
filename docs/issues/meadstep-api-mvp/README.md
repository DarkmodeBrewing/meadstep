# MeadStep API MVP Local Issues

Local API issue set generated from `docs/prds/meadstep-mvp-prd.md` and `docs/DECISIONS.md`.

These issues are intentionally stored in the repo instead of GitHub. Treat `status: needs-triage` as the local equivalent of the triage label.

## Breakdown

1. `001-fastify-api-foundation.md` - Fastify backend foundation, envelopes, errors, config, logging, health/readiness, CORS, body limits, method handling, and OpenAPI skeleton.
2. `002-reference-endpoints.md` - yeasts, assumptions, and options reference endpoints.
3. `003-honey-only-planner-endpoint.md` - planner calculation endpoint with canonical/display data and warning structure.
4. `004-standalone-tool-endpoints.md` - honey OG, gravity, ABV, sugar break, scale, and fruit sugar endpoints as core support lands.
5. `005-planner-markdown-api-output.md` - planner Markdown in the calculation response once core Markdown exists.
6. `006-api-contract-polish.md` - OpenAPI completeness, route smoke tests, error consistency, operational boundaries, and final API contract review.

## Dependency Order

```text
001
  -> 002
  -> 003
    -> 005
  -> 004
  -> 006
```

The Angular frontend remains local-first and direct-to-core for MVP. These API issues create a contract-compatible backend around `@meadstep/core`; they do not move formula ownership into the backend.
