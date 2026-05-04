There are **a few small, high-impact MVP additions** that punch way above their weight—and I’d include them _before_ going bigger.

---

# 🔥 High-impact MVP additions (don’t skip these)

## 1. 🍯 Honey → OG quick calculator (standalone)

Even if it exists inside the planner, expose it as its own tool.

**Why:**

- This is _the_ most used quick calc in mead making
- People Google this constantly
- It’s your top-of-funnel traffic magnet

**Input:**

- Honey (kg)
- Volume (L/Gal)

**Output:**

- OG
- Brix
- Estimated ABV potential

---

## 2. 🍷 ABV + FG estimator (forward + reverse)

You already mentioned ABV calc—but make sure it supports:

### Mode A (classic)

- OG + FG → ABV

### Mode B (reverse)

- OG + target ABV → estimated FG

**Why this matters:**
This is how brewers _think_ when designing recipes.

---

## 3. ⚖️ Batch scaling tool

Dead simple:

- Input: recipe (or just honey amount + volume)
- Output: scaled to new volume

**Why:**
People constantly go:

> “I did 5L, now I want 12L”

---

## 4. 📊 1/3 sugar break calculator

This is **critical** for TOSNA + step feeding alignment.

**Input:**

- Starting OG (or Brix)

**Output:**

- Gravity at 1/3 sugar break

Example:

```text
OG: 1.120
1/3 break: ~1.080
```

**Why:**

- TOSNA depends on it
- Most brewers don’t calculate it correctly
- Super low effort, high value

---

## 5. 🍇 Fruit sugar estimator (simple version)

Don’t overbuild this.

**MVP version:**

- Fruit type (dropdown)
- Weight (kg/lb)
- Volume (L/Gal)

**Output:**

- Estimated gravity contribution
- Adjusted OG

**Why:**
Melomels are extremely common—and people always underestimate sugar from fruit.

---

## 6. ⚠️ “Sanity check” warnings (lightweight)

Not a full diagnostic system—just a few key checks:

- “Initial OG above 1.120 → consider step feeding”
- “Target ABV within 1% of yeast tolerance”
- “No nutrients selected for high gravity must”

**Why:**
This adds _huge perceived intelligence_ with minimal effort.

---

## 🧠 What you _don’t_ need in MVP

Avoid these for now:

- Full fermentation tracking
- Blending calculators
- Delle / stabilization
- Acid/tannin balancing
- OAuth / Stripe
- Complex yeast modeling

All great—but not needed to validate.

---

## 🧩 Clean MVP tool set (final)

If I compress everything into a **perfect V1**, it’s this:

### Core

- Step feeding + TOSNA planner ⭐
- ABV calculator (2 modes)
- OG/Brix/Plato converter
- Honey → OG calculator

### Support

- 1/3 sugar break calculator
- Batch scaling
- Basic fruit sugar estimator
- Lightweight warnings

---

## 🎯 Why this works

This combo gives you:

- **Discovery tools** (OG calc, ABV calc)
- **Design tools** (planner)
- **Confidence tools** (warnings)

That’s a complete loop:

> idea → plan → sanity check → brew

---

## 🍯 Final take

We're not missing anything critical.

But adding:

- honey OG calc
- 1/3 sugar break
- reverse ABV calc

---
