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

## Implementation Decisions

- Build a shared TypeScript domain package as the deep module for MeadStep calculations. It owns formulas, Zod schemas, yeast data, warning logic, unit conversions, planner orchestration, standalone calculator logic, and Markdown generation.
- Keep calculation inputs and outputs stable and structured. UI should render structured results and export the Markdown string generated from the same result.
- Use metric units internally and convert at the boundaries for metric and US display/input support.
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
- Always generate a plan even when target ABV exceeds yeast tolerance, but emit severe warnings and an estimated tolerance-limited FG hint.
- Use the simple tolerance-limited FG warning estimate based on consumed gravity points from listed yeast tolerance. Label it as an estimate, not a promise.
- Provide compact navigation with the planner as the first/default tool and standalone tools for honey OG, ABV, gravity conversion, sugar break, scaling, and fruit sugar.
- Do not implement account login, cloud sync, saved recipes, PDF export, protocol selection, Go-Ferm dosage, Delle/stabilization, blending, backsweetening, or fermentation tracking in this MVP.

## Testing Decisions

- Tests should verify external behavior: given user-level inputs, the shared package returns expected planner results, warnings, schedules, conversions, and Markdown. Avoid tests that assert private helper structure.
- The shared calculation package needs focused unit tests for unit conversions, SG/Brix conversion, ABV estimates, honey gravity calculations, initial OG capping, step-feed splitting, 1/3 sugar break, TOSNA totals and splits, yeast tolerance warnings, tolerance-limited FG hints, batch scaling, fruit sugar estimation, and Markdown generation.
- Planner tests should cover normal-strength batches, high-gravity step-fed batches, manual initial OG override, small and large batch unit scaling, near-tolerance plans, above-tolerance plans, and extreme step-feed warnings.
- UI tests should verify that changing inputs recalculates displayed outputs without a submit button, that metric and US unit displays are coherent, and that copy/download actions use the same generated Markdown.
- Backend tests are minimal for MVP unless backend endpoints start exposing planner behavior. If the backend uses the shared package later, endpoint tests should assert API contracts rather than formula internals.
- Existing prior art is limited because the repo is currently a shell. The test strategy should establish the pattern for pure domain-package tests first, then frontend behavior tests around rendered user workflows.

## Out of Scope

- Saved recipes, local recipe library, recipe editing, and recipe versioning.
- User accounts, OAuth, cloud sync, Stripe, subscriptions, and pro features.
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
- The initial codebase has a monorepo shell with Angular frontend and Node backend packages, but the calculation domain package has not been created yet.
- The MVP should prioritize trustworthiness over breadth. Warnings and estimates should be clear about assumptions, especially honey variability and yeast tolerance behavior.
- The product name is currently MeadStep, a working name.
