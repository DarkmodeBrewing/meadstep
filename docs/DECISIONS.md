# MeadStep MVP Decisions

This document records product and implementation decisions made during MVP planning.
Use it to resolve ambiguity when the broader docs conflict or leave room for interpretation.

## Architecture

- Shared formulas and domain logic will live in a shared TypeScript package, for example `@meadstep/core`.
- The shared package should contain pure calculation functions, Zod schemas, yeast data, warning logic, unit conversions, and markdown generation.
- The frontend should use the shared package directly for instant local recalculation.
- The backend may later expose the same shared package through an API, but it is not the sole source of calculation truth.
- Core calculations should remain deterministic and internally metric.
- The Angular app should use route-based navigation. `/` redirects to `/planner`; MVP routes are `/planner`, `/honey-og`, `/abv`, `/gravity`, `/sugar-break`, `/scale`, and `/fruit`.
- `App` should remain a thin shell that composes the header, tool navigation, and router outlet. Planner and tool behavior belongs in feature routes, not in `app.ts` / `app.html`.
- Use feature-first frontend organization with `app/shell/`, `app/shared/ui/`, `app/shared/preferences/`, `app/shared/notices/`, `app/features/planner/`, and `app/features/tools/...`.
- Use route-level smart containers plus facade services. Facades own Signal Form or signal state, validation, calls into `@meadstep/core`, UI view models, notice registration, and export state.
- Use dumb reusable presentation components for the custom design system. They should receive plain values/errors/helper text and emit changes rather than knowing MeadStep formulas.
- Use Angular standalone components, signals, computed values, and latest Angular template control flow. Angular Signal Forms are available in Angular 21 and should be used where practical, with facade-owned signal state as a fallback if the experimental API blocks implementation.

## API

- Expose a versioned HTTP API around `@meadstep/core`, but do not move formula ownership into the backend.
- The Angular MVP remains local-first and direct-to-core for instant recalculation. API parity should make a future frontend HTTP adapter possible, but it is not required for MVP UI behavior.
- Use Fastify once the backend grows beyond `GET /healthz`.
- Backend file organization should follow:

```text
apps/backend/src/
  server.ts
  index.ts
  config/
  http/
    routes/
    schemas/
    errors.ts
    envelope.ts
  services/
    planner-api.service.ts
    tools-api.service.ts
    reference-api.service.ts
  tests/
```

- `index.ts` should load config and start the server. `server.ts` should build the Fastify app for tests and runtime.
- Route handlers should handle HTTP mechanics, schemas, and envelopes. Thin API services should call `@meadstep/core` and normalize results into API DTOs. Do not put formulas in backend services.
- Keep `GET /healthz` unversioned for liveness. Add `GET /readyz` for readiness; MVP readiness can verify config and core import/use.
- Use `/api/v1` for versioned routes.
- Calculation endpoints are `POST` and use noun paths:
  - `/api/v1/planner/honey-only`
  - `/api/v1/tools/honey-og`
  - `/api/v1/tools/abv`
  - `/api/v1/tools/gravity`
  - `/api/v1/tools/sugar-break`
  - `/api/v1/tools/scale`
  - `/api/v1/tools/fruit-sugar`
- Reference endpoints are `GET`:
  - `/api/v1/reference/yeasts`
  - `/api/v1/reference/assumptions`
  - `/api/v1/reference/options`
- `reference/assumptions` should include machine-readable constants with ids, values, units, display text, and `assumptionsVersion`.
- `reference/options` should include enums/options such as unit systems, nitrogen requirement values, and warning severities.
- API contracts use camelCase JSON fields.
- API calculation inputs should accept user-facing unit inputs plus `unitSystem` where relevant and return both canonical metric results and selected-unit display results.
- Reject unknown JSON request fields with `400 validation_failed`.
- Require JSON numbers for numeric API inputs. Do not coerce numeric strings in request bodies.
- Use backend HTTP schemas that wrap or reuse core Zod schemas rather than duplicating domain validation. Translate domain validation errors to API request paths.
- Use stable response envelopes:

```json
{
  "data": {},
  "meta": {
    "apiVersion": "v1",
    "generatedAt": "2026-05-06T00:00:00.000Z",
    "assumptionsVersion": "mvp-1",
    "requestId": "..."
  }
}
```

- Use stable error envelopes:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Request validation failed.",
    "issues": [
      {
        "path": ["batchVolume"],
        "message": "Batch volume must be greater than 0."
      }
    ]
  },
  "meta": {
    "apiVersion": "v1",
    "requestId": "..."
  }
}
```

- Stable API error codes include `validation_failed`, `not_found`, `method_not_allowed`, `invalid_json`, `payload_too_large`, and `internal_error`.
- Unknown paths return `404 not_found`. Known paths with unsupported methods return `405 method_not_allowed` and an `Allow` header.
- Accept a sane inbound `X-Request-Id` or generate one. Return it in the `X-Request-Id` response header and envelope `meta`.
- Use UTC ISO strings for API timestamps.
- Calculation warnings should include stable codes, severity, affected field/section metadata, and plain human-readable messages.
- Planner calculation responses should include generated Markdown once the core generator exists. Standalone tool endpoints should return structured data only.
- Maintain `docs/api/openapi-v1.yaml` as the checked-in OpenAPI contract. Swagger UI is out of scope for MVP.
- Enable CORS by environment. Allow local frontend origins in development and explicit `CORS_ORIGINS` in deployed environments. Do not use wildcard CORS by default.
- Set a configurable JSON body limit with `BODY_LIMIT_BYTES`, defaulting around `32kb`.
- Use structured logging with `LOG_LEVEL`, defaulting to `info`. Log to stdout by default. Environment variables may enable file logging and set the log path; log consumption/rotation is infrastructure-owned.
- Keep API and Angular static hosting separate in MVP.
- No API authentication in MVP. If the product later becomes authenticated, add bearer token validation at the API boundary.
- Do not add public API exposure, rate limiting, or batch/multi-calculation endpoints in MVP.

## Units

- Support metric and US units out of the box.
- Internal calculations should use:
  - liters
  - kilograms / grams
  - SG / Brix
  - Celsius if temperature is introduced
- UI and export output should follow the user's selected unit system.
- Unit system is a global app preference shared across routes.
- Store unit and theme preferences in `localStorage`, while keeping recipe and plan persistence out of scope.
- Theme supports `system`, `light`, and `dark`; `system` follows the OS color-scheme preference until the user chooses explicitly.

## Core Planner Scope

- The main planner is honey-only for MVP.
- Fruit sugar belongs in a standalone estimator for MVP, not in the main fermentation planner.
- Recipe saving is deferred.
- Export includes both copyable markdown and downloadable `.md` output.
- Copy and download must use the same markdown string generated by the shared package.

## Starting Gravity Strategy

- Automatic starting gravity should cap initial OG at about `1.110`.
- If the total honey load would exceed that initial OG, remaining honey is assigned to step feeds.
- Manual OG override means manual initial OG only.
- Total equivalent OG remains derived from target ABV and total fermentable load.
- Manual initial OG above warning thresholds should still generate a plan with warnings.

## Honey Assumptions

- Default honey gravity contribution:
  - `35 PPG`
  - `82%` fermentable sugar by weight
  - approximately `290 gravity points per kg per liter`
- Add a user-facing note that honey varies and measured OG should be trusted when precision matters.

## Step Feeding

- Step feeding instructions should be based primarily on gravity milestones, with approximate day labels as secondary guidance.
- Step-feed count is derived from remaining honey amount relative to batch size.
- Preferred maximum feed size is `50 g/L`.
  - Example: `5 L` batch means preferred max `250 g` per feed.
- Calculate ideal feed count as:

```text
idealFeedCount = ceil(remainingHoneyG / (50 * volumeL))
```

- Auto-generated plans should cap at `4` step feeds.
- If more than `4` feeds would be needed to stay under `50 g/L`, generate `4` feeds and warn that each feed exceeds the preferred cap.
- Default feed amounts can be equal splits for MVP.
- Each gravity milestone should be calculated as the SG at which adding that feed returns the must to the initial pitch OG:

```text
feedGravityPoints = (feedHoneyKg * 290) / volumeL
gravityMilestone = initialPitchOg - (feedGravityPoints / 1000)
```

- Clamp a calculated milestone below `1.000` to `1.000` and warn that the chosen pitch OG cannot be maintained within the four-feed limit.
- Approximate feed days default to `Day 2`, `Day 4`, `Day 6`, and `Day 8` for feeds one through four.
- Approximate days are planning guidance only. If the gravity milestone has not been reached, wait for the measured SG before feeding.

## TOSNA / Nutrients

- The main planner assumes TOSNA 2.0 with Fermaid O only.
- TOSNA amount should default to initial must Brix, not total planned fermentable load.
- Structure the code so a later `totalPlanned` basis can be added without changing result shapes.
- Use the TOSNA schedule:
  - `24 hours after pitch`
  - `48 hours after pitch`
  - `72 hours after pitch`
  - `1/3 sugar break`
- Do not use the older `Day 0 / 2 / 4 / 6` schedule as the canonical planner output.
- Include short yeast rehydration guidance in generated plans, but do not calculate Go-Ferm dosage in MVP.

## Yeast

- Ship a curated built-in yeast list plus a custom yeast option.
- Built-in MVP yeast list:
  - EC-1118
  - K1-V1116
  - D47
  - 71B
  - QA23
  - Premier Blanc
  - US-05
- Custom yeast should allow:
  - name
  - alcohol tolerance %
  - nitrogen requirement: `low`, `medium`, or `high`
- Custom yeast entry belongs inside the planner Advanced section rather than a separate route.
- Pitch rate and temperature ranges may remain display-only or post-MVP.

## Warnings And Tolerance

- Always generate a plan, even when target ABV exceeds selected yeast tolerance.
- Use tolerance margin warning levels:
  - `>= 2.0%` below tolerance: normal
  - `1.0-1.9%` below tolerance: moderate warning
  - `0.0-0.9%` below tolerance: high warning
  - above listed tolerance: severe warning
- When target ABV exceeds tolerance, include an estimated tolerance-limited FG hint.
- Use the simple MVP estimate:

```text
consumedPoints = yeastToleranceAbv / 0.13125
estimatedStopFg = totalEquivalentOg - consumedPoints / 1000
```

- Label the estimate carefully, for example:

```text
If the yeast stops near its listed tolerance, FG may finish around 1.053.
```

- This estimate is for warnings only, not a precise final gravity promise.
- Warnings should be modeled as reusable notices with severity, title/message, optional action guidance, and source/placement metadata.
- Severity color mapping:
  - blue: info
  - green: ok
  - yellow: warning
  - red: error
- Inline notice callouts should appear near the relevant section, and the active worksheet should also render a compact summary from an Angular notice summary service.
- Notice styling should be visible but not intrusive: light outline, compact spacing, and a small severity icon.

## Standalone MVP Tools

- Include the core planner as the default first screen.
- Add compact navigation for standalone tools:
  - Planner
  - Honey OG
  - ABV
  - Gravity
  - Sugar Break
  - Scale
  - Fruit
- Include simple batch scaling:
  - original volume
  - target volume
  - honey amount
  - optional nutrient amount
  - optional fruit amount
  - output scale factor and scaled quantities
- Include fruit sugar as a standalone estimator only.

## UX

- The first screen should be the core planner, not a generic tool dashboard.
- The app should behave like a live brew-planning worksheet, not a dashboard of calculator cards.
- Use mobile-first layout. On mobile, planner sections flow as Setup, Initial Must, Step Feeds, Nutrients, Warnings, and Export. On tablet/desktop, use a sticky input column with live results beside it.
- Use a compact app header containing MeadStep, unit toggle, and theme toggle. Tool navigation sits below the header as a top horizontal scroll nav on mobile.
- Standalone tools should follow the same focused worksheet pattern: inputs, primary result, secondary details/conversions, then short assumption notes.
- Use a small custom design system instead of Angular Material.
- Visual style should feel like a clean brewing lab notebook: light/dark design tokens, high-contrast text, restrained borders, compact controls, practical result blocks, and sparing honey/amber accents.
- Recalculate instantly without a submit button.
- Keep warnings plain and actionable.
- Generated brew plans should be practical instructions, not derivations.
- Hide advanced planner inputs in a collapsible Advanced section. Manual initial OG override and custom yeast details are advanced controls.
- Use inline validation with an error border and small field-level message. Invalid dependent results should show a neutral "enter valid values" state without blocking unrelated sections.
- Keep copy and download actions visible once a valid plan exists. The full Markdown preview is collapsed by default on mobile and may be visible on desktop when space allows.

## Frontend Testing

- Core formula tests stay in `@meadstep/core`.
- Frontend tests should cover route facades, UI view models, validation states, preference behavior, and representative rendered route workflows.
- Dumb UI primitives need tests when they contain real behavior beyond display.
