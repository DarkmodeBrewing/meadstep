# 🍯 Product Definition — *MeadStep (working name)*

## 1. 🎯 Product Summary

A **free, mobile-first web tool** that generates a complete **step feeding + TOSNA nutrient plan** for mead fermentation in seconds.

> Built for mead makers who want to hit high ABV cleanly without stalls or guesswork.

---

## 2. 🧩 Core Problem

Mead makers struggle with:

* How much honey to add initially vs in steps
* When and how much to feed during fermentation
* How to align step feeding with TOSNA nutrient additions
* Avoiding stalled or stressed fermentations

Existing tools are:

* fragmented (separate calculators)
* unclear
* not aligned into one plan

---

## 3. 💡 Core Value Proposition

> “Plan your entire mead fermentation in one go.”

User inputs a few parameters → gets a **complete, actionable fermentation schedule**:

* Honey additions
* Feeding timeline
* Nutrient schedule
* Risk warnings

---

## 4. 👤 Target User

* Intermediate homebrewers making mead
* Especially those:

  * aiming for 10–18% ABV
  * doing step feeding
  * using TOSNA / Fermaid O

---

## 5. ⚙️ MVP Scope (Version 1)

### Inputs

* Batch volume (L)
* Target ABV (%)
* Yeast selection (with tolerance)
* Starting gravity strategy:

  * Auto (recommended)
  * Manual OG (optional override)

---

### Other tools
* Brix/Plato to SG conversion (both ways)
* OG to ABV calculator

### Outputs

#### 🍯 Honey Plan

* Initial honey addition (kg)
* Step feeding schedule:

  * Day X → amount (g)

#### 🧪 Nutrient Plan (TOSNA)

* Total nutrient required
* Split into additions:

  * Day 0 / 2 / 4 / 6

#### 📊 Estimated Stats

* Estimated OG (initial + final)
* Estimated FG range
* Estimated ABV

#### ⚠️ Warnings

* Yeast tolerance risk
* High OG stress warning
* Nutrient requirement note

---

### 📋 Export

**Copyable Brew Plan (text block)**

```text
Batch: 5L
Target ABV: 16%

Initial:
- 1.2 kg honey

Step feeding:
- Day 2: +300 g
- Day 4: +300 g

TOSNA:
- Day 0: 1.2 g
- Day 2: 1.2 g
- Day 4: 1.2 g
- Day 6: 1.2 g
```

---

## 6. 🧠 Key UX Principles

* **Mobile-first** (usable mid-brew)
* **Instant recalculation** (no submit button)
* **Minimal inputs → maximal output**
* **Opinionated defaults** (guide user)
* **Readable, practical output (not academic)**

---

## 7. 🚀 Success Criteria (Validation)

Within first release:

* Users share tool in brewing communities
* Comments like:

  * “This is super useful”
  * “This is better than X”
* Requests for:

  * saving recipes
  * adding features

---

## 8. 🪜 Post-MVP Expansion

### Phase 2

* Save recipes (local storage)
* PDF export
* Yeast library expansion

### Phase 3 (Maybe monetization)

* OAuth login
* Cloud sync
* Batch tracking
* Advanced tools:

  * blending calculator
  * backsweetening calculator
  * Delle/stabilization

---

## 9. 💰 Possible Monetization Strategy (Later)

Freemium:

* Free → core planner
* Pro ($5/mo or yearly)

  * saved batches
  * advanced planning tools
  * fermentation tracking

---

## 10. 🏗️ Technical Direction

* Typescript
* Typing using zod
* Keep formatting tight using Prettier
* Monorepo
* Frontend: Angular latest version (signals for reactive calculations)
* Backend: Calculation formulas should live in API. Backend in Node, using typescript.
* State: local-first, database backed later
* Architecture:

  * Output in markdown should be available
  * pure calculation functions
  * deterministic outputs
  * no external dependencies required

### Missed tools?

Are there basic tools aimed at mead making that has been missed? Calculations that needs to be implemented?

---

## 11. 🧨 Unique Edge

> Combines **step feeding + TOSNA into one coherent plan**

Most tools:

* calculate one thing

This:

* plans the **entire fermentation strategy**

---

## 12. 🏁 MVP Definition of Done

* User can use misc tools for conversions/calculations
* User can input batch + ABV + yeast
* Tool generates full plan instantly
* Output is clear, usable, and copyable
* Works smoothly on mobile
* Deployed publicly

---


