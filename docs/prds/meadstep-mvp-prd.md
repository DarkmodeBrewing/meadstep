# MeadStep MVP PRD

## Problem Statement

Mead makers who want to design clean, high-ABV fermentations currently have to stitch together separate calculators, forum advice, and handwritten schedules. They need to decide how much honey to add at pitch, how much to reserve for step feeding, when to feed, how to align Fermaid O nutrient additions with TOSNA, and whether the plan is likely to stress or exceed their yeast.

This creates avoidable uncertainty during recipe design and during brew day. The user wants a mobile-first tool that turns a few practical inputs into a complete, copyable fermentation plan with honey additions, TOSNA nutrient timing, estimated stats, and plain warnings.

## Solution

Build the MeadStep MVP as a local-first web toolbox whose default first screen is the core honey-only step-feeding + TOSNA planner. The user enters batch volume, target ABV, yeast, and either an automatic or manual initial OG strategy. The app instantly recalculates a complete fermentation plan without a submit button.

The planner should produce:

- Initial honey amount.
- Step-feed schedule based primarily on gravity milestones, with approximate day guidance.
- TOSNA 2.0 / Fermaid O nutrient total and four-part schedule.
- Estimated initial OG, total equivalent OG, estimated ABV, and FG guidance.
- Warning levels for high initial OG, high total gravity, nutrient demand, yeast tolerance margin, and tolerance-limited finishing gravity.
- Copyable and downloadable Markdown generated from the same calculation result shown in the UI.

The MVP also includes standalone support tools: honey to OG, ABV, gravity conversion, 1/3 sugar break, simple batch scaling, and fruit sugar estimation. Fruit sugar remains outside the main planner until fruit timing and modeling are mature enough not to mislead.

The Angular application should feel like a live brew-planning worksheet, not a calculator dashboard or landing page. The root app component should remain a thin shell. Route-level feature containers, facades, shared preference services, shared notice services, and reusable presentation components should carry the application behavior and UI.

The backend API should expose a versioned HTTP contract around the same shared `@meadstep/core` calculations, but it should not become the source of formula truth. The Angular MVP remains local-first and direct-to-core for instant recalculation. The API exists to make contracts testable, support future clients, and keep backend integration ready without making the browser depend on HTTP.

## User Stories

1. As a mead maker, I want the planner to open first, so that I can immediately design a fermentation plan rather than choose from a generic calculator dashboard.
2. As a mobile brewer, I want the app to work comfortably on a phone, so that I can use it mid-brew.
3. As a recipe designer, I want to enter batch volume, so that all honey and nutrient amounts scale to my batch.
4. As a metric user, I want to enter and read liters, kilograms, and grams, so that the plan matches my normal brewing workflow.
5. As a US-unit user, I want to enter and read gallons, pounds, and ounces, so that the plan matches my normal brewing workflow.
6. As a brewer, I want calculations to use a consistent internal unit system, so that switching display units does not change the result.
7. As a mead maker, I want to choose a target ABV, so that the planner can estimate the total honey load needed.
8. As a mead maker, I want to choose a yeast strain from a curated list, so that tolerance and nutrient defaults are filled in automatically.
9. As an advanced brewer, I want to enter custom yeast tolerance and nitrogen requirement, so that I can plan with yeast not included in the curated list.
10. As a brewer using EC-1118, I want its high alcohol tolerance and low nitrogen requirement reflected, so that my plan is not over-warned.
11. As a brewer using D47, I want its lower tolerance and high nutrient requirement reflected, so that the planner warns me about stress risks.
12. As a brewer, I want automatic starting gravity to cap initial OG around 1.110, so that strong batches are automatically moved into step feeding.
13. As an experienced brewer, I want to override initial OG manually, so that I can pitch at the gravity I intend.
14. As a brewer, I want manual OG override to mean initial pitch OG, so that the app matches what I can measure with a hydrometer.
15. As a brewer, I want the planner to calculate initial honey from initial OG, so that my pitch must is practical to mix.
16. As a brewer, I want remaining honey to become step feeds, so that I can reach high ABV without starting with an extreme must.
17. As a brewer, I want step-feed count to scale with remaining honey and batch size, so that small and large batches are handled proportionally.
18. As a brewer making a 5 L batch, I want the preferred feed cap to be around 250 g per feed, so that each feeding remains manageable.
19. As a brewer making a different batch size, I want the preferred feed cap to scale at 50 g/L, so that feed size stays proportional.
20. As a brewer, I want auto-generated step feeds capped at four, so that the plan stays followable.
21. As a brewer, I want a warning when the recipe would need more than four feeds to stay under the preferred cap, so that I know the plan is becoming extreme.
22. As a brewer, I want feed instructions tied to gravity milestones, so that I feed based on fermentation progress rather than the calendar alone.
23. As a brewer without daily gravity readings, I want approximate day labels beside feed milestones, so that I still have practical guidance.
24. As a TOSNA user, I want the nutrient schedule to use Fermaid O, so that the calculator matches the protocol I am following.
25. As a TOSNA user, I want nutrient amount based on initial must Brix, so that the calculator follows the canonical MVP protocol.
26. As a brewer, I want nutrient additions at 24h, 48h, 72h, and 1/3 sugar break, so that the schedule matches TOSNA 2.0 expectations.
27. As a brewer, I want the app to calculate the 1/3 sugar break, so that I know when the final nutrient addition and early step-feed milestones occur.
28. As a brewer, I want the plan to include short yeast rehydration guidance, so that high-gravity batches remind me to prepare yeast carefully.
29. As a brewer, I do not want Go-Ferm dosage calculated in MVP, so that the app does not pretend to support a protocol it has not modeled.
30. As a brewer, I want estimated initial OG, so that I can compare the plan against my measured gravity.
31. As a brewer, I want estimated total equivalent OG, so that I understand the full fermentable load.
32. As a brewer, I want estimated ABV, so that I can see whether the plan matches my target.
33. As a brewer, I want the app to warn when initial OG is above 1.120, so that I understand pitch stress risk.
34. As a brewer, I want the app to warn when total equivalent OG is high, so that I understand the batch style and difficulty.
35. As a brewer, I want the app to warn when target ABV is close to yeast tolerance, so that I can choose a stronger yeast or adjust expectations.
36. As a brewer, I want the app to still generate a plan above yeast tolerance, so that I can intentionally push limits without being blocked.
37. As a brewer, I want severe warnings above yeast tolerance, so that I do not mistake the target for a likely dry finish.
38. As a brewer, I want an estimated tolerance-limited FG hint when target ABV exceeds tolerance, so that I can anticipate residual sweetness or stall risk.
39. As a brewer, I want warnings written plainly, so that I know what action to take.
40. As a brewer, I want honey assumptions documented in the UI, so that I know honey varies and measured OG should win.
41. As a brewer, I want a honey to OG standalone calculator, so that I can quickly estimate gravity from honey and volume.
42. As a brewer, I want the honey calculator to output OG, Brix, and ABV potential, so that it is useful outside the full planner.
43. As a brewer, I want an ABV calculator from OG and FG, so that I can estimate actual fermentation results.
44. As a recipe designer, I want reverse ABV estimation from OG and target ABV, so that I can estimate FG for planning.
45. As a brewer, I want SG and Brix/Plato conversion, so that I can use hydrometer or refractometer values.
46. As a TOSNA user, I want a standalone 1/3 sugar break calculator, so that I can use the tool even outside a generated plan.
47. As a brewer scaling a recipe, I want to enter original and target volume, so that honey and optional additions scale proportionally.
48. As a brewer scaling a recipe, I want optional nutrient and fruit quantities scaled, so that common recipe components move together.
49. As a melomel maker, I want a standalone fruit sugar estimator, so that I can estimate fruit gravity contribution without complicating the main planner.
50. As a brewer, I want fruit sugar to stay separate from the main planner in MVP, so that honey-only fermentation plans remain trustworthy.
51. As a brewer, I want a copy button for the generated Markdown, so that I can paste the plan into notes, chat, or forums.
52. As a brewer, I want to download the generated Markdown, so that I can keep a local brew-day document.
53. As a brewer, I want copied and downloaded plans to come from the same source text, so that exports do not drift from the displayed plan.
54. As a developer, I want formulas in a shared package, so that frontend and backend behavior stays consistent.
55. As a developer, I want calculation functions to be pure and deterministic, so that they can be tested independently.
56. As a developer, I want Zod schemas around planner inputs and result shapes, so that runtime validation is explicit.
57. As a developer, I want Markdown generated from the same result used by the UI, so that export behavior is stable and testable.
58. As a developer, I want the backend to be able to reuse the shared package later, so that API support does not fork the formula implementation.
59. As a maintainer, I want formula assumptions captured near tests or docs, so that future changes do not silently alter brewing recommendations.
60. As a maintainer, I want no recipe persistence in MVP, so that the first release avoids state-management complexity.
61. As a brewer, I want a worksheet-style planner layout, so that I can adjust inputs while reading the live fermentation plan.
62. As a brewer, I want each support tool to have its own route, so that I can deep-link and move directly to the calculator I need.
63. As a brewer, I want unit and theme preferences remembered, so that the app opens in the display mode I normally use.
64. As a brewer, I want light and dark modes that follow my system preference until I choose otherwise, so that the app is comfortable in brew-day lighting.
65. As a brewer, I want validation messages beside faulty fields, so that I can fix inputs without losing the rest of the worksheet.
66. As a brewer, I want warnings to be noticeable but not intrusive, so that risk is clear without crowding out the plan.
67. As a developer, I want the Angular frontend split into route-level smart features, facades, and dumb reusable UI components, so that the app does not collapse into large `app.ts` and `app.html` files.
68. As a developer, I want route facades to map core results into UI view models, so that templates stay simple and calculation logic remains outside components.
69. As a developer, I want Angular Signal Forms used where practical, with a signal-state fallback if the experimental API blocks implementation, so that forms follow current Angular direction without coupling the design system to API churn.
70. As a developer, I want frontend tests for facades/view models and rendered workflows, so that UI behavior is covered separately from core formula tests.
71. As an API client, I want versioned calculation endpoints, so that contract changes can be managed explicitly.
72. As an API client, I want separate endpoints for the planner and each standalone tool, so that each contract is focused and easy to test.
73. As an API client, I want calculation responses to include canonical metric data and selected-unit display data, so that results are deterministic and ready to render.
74. As an API client, I want success and error envelopes with metadata, so that responses are predictable across endpoints.
75. As an API client, I want validation errors to point to API request fields, so that bad requests are easy to fix.
76. As an API client, I want request ids in headers and response metadata, so that logs and client reports can be correlated.
77. As an API client, I want static reference endpoints for yeasts, assumptions, and options, so that valid inputs and formula assumptions are discoverable.
78. As a maintainer, I want OpenAPI documentation for `/api/v1`, so that the HTTP contract is explicit and testable.
79. As a maintainer, I want the API to reuse `@meadstep/core` through thin services, so that backend behavior does not fork formulas.
80. As a maintainer, I want Fastify-based backend structure with config, routes, schemas, errors, envelopes, services, and tests, so that the API stays maintainable as endpoints are added.
81. As a maintainer, I want CORS, payload limits, method handling, health/readiness endpoints, and structured logging configured, so that the API has sane operational boundaries.
82. As a maintainer, I want no authentication in MVP, so that the private calculation API stays simple until user accounts or saved data exist.

## Implementation Decisions

- Build a shared TypeScript domain package as the deep module for MeadStep calculations. It owns formulas, Zod schemas, yeast data, warning logic, unit conversions, planner orchestration, standalone calculator logic, and Markdown generation.
- Keep calculation inputs and outputs stable and structured. UI should render structured results and export the Markdown string generated from the same result.
- Use route-based Angular navigation. `/` should redirect to `/planner`; MVP tool routes are `/planner`, `/honey-og`, `/abv`, `/gravity`, `/sugar-break`, `/scale`, and `/fruit`.
- Keep `App` as the application shell. It should compose the header, route navigation, and router outlet, while feature routes own their own screens.
- Organize the frontend feature-first: `app/shell/`, `app/shared/ui/`, `app/shared/preferences/`, `app/shared/notices/`, `app/features/planner/`, and `app/features/tools/...`.
- Use route-level smart containers and facade services for planner and standalone tools. Facades own form state, calls into `@meadstep/core`, validation state, UI view models, and export state.
- Use dumb/presentational UI components for fields, toggles, notices, result rows, section panels, and navigation. Presentation components should receive plain inputs and emit changes; they should not own MeadStep calculation behavior.
- Use Angular standalone components, signals, computed values, and latest Angular control-flow patterns. Use Angular Signal Forms where practical; fall back to facade-owned signal state if the experimental Signal Forms API blocks a slice.
- Keep shared UI components mostly form-library-agnostic. Thin adapter components may bind Signal Forms fields to shared field components when useful.
- Use metric units internally and convert at the boundaries for metric and US display/input support.
- Store global app preferences in a service. Unit system and theme preference should be shared across routes and persisted in `localStorage`; recipe or plan persistence remains out of scope.
- Theme preference should support `system`, `light`, and `dark`. With `system`, follow the OS color-scheme preference.
- Keep the main planner honey-only for MVP. Fruit sugar estimation is standalone and does not feed the main fermentation plan.
- Use automatic initial OG capping around 1.110. Manual OG override applies only to initial pitch OG.
- Use default honey assumptions of 35 PPG, 82% fermentable sugar, and about 290 gravity points per kg per liter.
- Base step-feed count on remaining honey divided by a preferred maximum feed size of 50 g/L.
- Cap automatic step-feed schedules at four feeds and warn when the preferred cap would require more.
- Use gravity milestones as primary step-feed instructions, with approximate day labels as secondary guidance.
- Use TOSNA 2.0 with Fermaid O only for the main planner.
- Calculate TOSNA from initial must Brix for MVP, while leaving room in the domain model for a future total-planned basis.
- Use nutrient additions at 24h, 48h, 72h, and 1/3 sugar break.
- Include curated yeast data plus custom yeast entry. Custom yeast requires name, alcohol tolerance, and nitrogen requirement.
- Hide advanced planner inputs behind a collapsible Advanced section. Manual initial OG override and custom yeast details belong there; the default path should focus on batch volume, target ABV, unit system, yeast, and automatic initial OG.
- Always generate a plan even when target ABV exceeds yeast tolerance, but emit severe warnings and an estimated tolerance-limited FG hint.
- Use the simple tolerance-limited FG warning estimate based on consumed gravity points from listed yeast tolerance. Label it as an estimate, not a promise.
- Provide compact navigation with the planner as the first/default tool and standalone tools for honey OG, ABV, gravity conversion, sugar break, scaling, and fruit sugar.
- Use a top horizontal scroll tool navigation below a compact app header on mobile. The header should contain the MeadStep name, unit toggle, and theme toggle. On larger screens, the navigation may become a compact top nav or left rail.
- Present the planner as one continuous mobile-first worksheet. On mobile, sections should flow as Setup, Initial Must, Step Feeds, Nutrients, Warnings, and Export. On tablet/desktop, use a sticky input column beside live results.
- Present each standalone tool as a focused worksheet: inputs first, primary result immediately below, secondary conversions/details below that, and short assumptions at the bottom.
- Use a compact custom design system rather than Angular Material. The visual language should feel like a clean brewing lab notebook: light/dark tokens, high contrast, restrained borders, compact controls, practical result blocks, and sparing honey/amber accents.
- Present warnings as inline notice callouts beside relevant sections and a compact summary near the active worksheet results. Warning notices should be noticeable but not intrusive, use a light outline, and include small severity icons. Severity colors are blue for info, green for ok, yellow for warning, and red for error.
- Provide a reusable notice model and Angular notice summary service so warnings can be registered by feature facades and rendered in multiple parts of a route.
- Use inline validation. Faulty fields should get an error border and a small error message below the field. Invalid dependent results should show a neutral "enter valid values" state while unrelated sections remain usable.
- Keep copy/download actions visible once a valid plan exists. The full Markdown preview should live in an expandable Export section by default on mobile; it may be visible in the desktop results column when space allows.
- Do not implement account login, cloud sync, saved recipes, PDF export, protocol selection, Go-Ferm dosage, Delle/stabilization, blending, backsweetening, or fermentation tracking in this MVP.
- Expose API calculation endpoints as a wrapper around `@meadstep/core`, while keeping the Angular frontend local-first and direct-to-core for MVP.
- Use Fastify for the backend API rather than Node's raw `http` module once API routes move beyond health checks.
- Keep `GET /healthz` unversioned for liveness and add `GET /readyz` for readiness.
- Use `/api/v1` for versioned API routes. MVP calculation routes are `POST /api/v1/planner/honey-only`, `POST /api/v1/tools/honey-og`, `POST /api/v1/tools/abv`, `POST /api/v1/tools/gravity`, `POST /api/v1/tools/sugar-break`, `POST /api/v1/tools/scale`, and `POST /api/v1/tools/fruit-sugar`.
- Use noun-based paths with HTTP verbs carrying the action semantics. Calculation endpoints are `POST`; static reference endpoints are `GET`.
- Add `GET /api/v1/reference/yeasts`, `GET /api/v1/reference/assumptions`, and `GET /api/v1/reference/options`.
- API request and response JSON uses camelCase.
- API request bodies must reject unknown fields with `400 validation_failed` and must require JSON numbers rather than numeric strings.
- API responses use envelopes. Success responses contain `data` and `meta`; error responses contain `error` and `meta`.
- Response metadata should include `apiVersion`, `generatedAt` as a UTC ISO string, `assumptionsVersion`, and `requestId` where applicable.
- Accept a sane inbound `X-Request-Id` or generate one. Return it in the `X-Request-Id` response header and response `meta`.
- API error codes should be stable, including `validation_failed`, `not_found`, `method_not_allowed`, `invalid_json`, `payload_too_large`, and `internal_error`.
- Unknown routes return `404 not_found`; known routes with unsupported methods return `405 method_not_allowed` and an `Allow` header.
- Backend HTTP schemas should wrap or reuse core Zod schemas rather than duplicating formula validation. Domain validation errors should be translated to API request paths.
- Route handlers should stay thin. API service modules call `@meadstep/core`, normalize results into API DTOs, and keep formulas out of the backend.
- Calculation responses should include machine-readable warning codes, severity, and affected field/section metadata plus plain human-readable warning messages.
- Planner responses should include generated Markdown once the core Markdown generator exists. Standalone tools should return structured calculation results only.
- Maintain `docs/api/openapi-v1.yaml` as the checked-in API contract. A Swagger UI is out of scope for MVP.
- Enable CORS by environment: local frontend origins in development and explicit `CORS_ORIGINS` for deployed environments. Avoid wildcard CORS by default.
- Keep API and Angular static hosting separate for MVP.
- Set a small configurable JSON body limit, defaulting around `32kb`, and return `413 payload_too_large` for oversized requests.
- Use structured logging with environment-controlled `LOG_LEVEL`. Log to stdout by default. Environment variables may enable file logging and set the file path; log consumption/rotation is infrastructure-owned.
- Do not implement API authentication in MVP. A future authenticated product should add bearer token validation at the API boundary.
- Do not add batch/multi-calculation API endpoints in MVP.

## Testing Decisions

- Tests should verify external behavior: given user-level inputs, the shared package returns expected planner results, warnings, schedules, conversions, and Markdown. Avoid tests that assert private helper structure.
- The shared calculation package needs focused unit tests for unit conversions, SG/Brix conversion, ABV estimates, honey gravity calculations, initial OG capping, step-feed splitting, 1/3 sugar break, TOSNA totals and splits, yeast tolerance warnings, tolerance-limited FG hints, batch scaling, fruit sugar estimation, and Markdown generation.
- Planner tests should cover normal-strength batches, high-gravity step-fed batches, manual initial OG override, small and large batch unit scaling, near-tolerance plans, above-tolerance plans, and extreme step-feed warnings.
- UI tests should verify that changing inputs recalculates displayed outputs without a submit button, that metric and US unit displays are coherent, and that copy/download actions use the same generated Markdown.
- Frontend feature tests should cover facade/view-model behavior, validation states, preference behavior where relevant, and rendered route workflows. Dumb UI primitives need focused tests only when they contain behavior beyond display.
- Backend tests should use Vitest once API endpoints are implemented. Fastify route tests should use `app.inject()` and assert envelopes, status codes, validation behavior, method handling, request ids, canonical/display output shape, and representative smoke values. Core tests remain responsible for formula precision.
- Existing prior art is limited because the repo is currently a shell. The test strategy should establish the pattern for pure domain-package tests first, then frontend behavior tests around rendered user workflows.

## Out of Scope

- Saved recipes, local recipe library, recipe editing, and recipe versioning.
- User accounts, OAuth, cloud sync, Stripe, subscriptions, and pro features.
- API authentication and bearer token validation.
- Public API exposure, rate limiting, and batch calculation endpoints.
- Serving the Angular static app from the backend API server.
- PDF export.
- Fruit contributions inside the main planner.
- Complex fruit modeling such as varietal sugar ranges, fruit form, water displacement, primary vs secondary timing, and volume changes.
- Nutrient protocols other than TOSNA 2.0 / Fermaid O.
- Go-Ferm dosage and detailed yeast rehydration calculations.
- Fermentation tracking, daily logging, and batch status management.
- Delle/stabilization calculations.
- Backsweetening and blending calculators.
- Acid, tannin, pH, and sensory balancing.
- Complex yeast performance modeling beyond listed tolerance and nitrogen requirement.

## Further Notes

- `docs/DECISIONS.md` is the implementation decision log for this PRD and should be treated as the source of truth when it conflicts with older planning notes.
- `docs/tool-spec.md` remains the broader product definition, while formula docs and notes provide supporting context.
- The codebase has a monorepo shell with Angular frontend, Node backend, and an initial `@meadstep/core` calculation package from the first implemented MVP slice.
- The MVP should prioritize trustworthiness over breadth. Warnings and estimates should be clear about assumptions, especially honey variability and yeast tolerance behavior.
- The product name is currently MeadStep, a working name.
