# Suggested canonical schema for yeat strains

```ts
type Yeast = {
  brand: string;
  name: string;

  type: "wine" | "beer" | "mead" | "champagne";

  alcoholTolerance: number; // %
  pitchRateGPerL: {
    min: number;
    max: number;
  };

  tempRangeC: {
    min: number;
    max: number;
  };

  nitrogenRequirement: "low" | "medium" | "high";

  attenuation?: number;
  flocculation?: "low" | "medium" | "high";

  notes: string[];
};
```

Here is a **clean, normalized MVP yeast dataset** based on real manufacturer specs, and mapped **TOSNA nitrogen factors** in a way that actually makes sense for your calculator.

This is exactly the kind of dataset you can drop straight into code.

---

# 🧬 MVP Yeast Dataset (normalized)

## 🍾 Wine/mead core strains

### EC-1118 (baseline powerhouse)

```ts
{
  brand: "Lallemand",
  name: "EC-1118",
  type: "wine",

  alcoholTolerance: 18,
  pitchRateGPerL: { min: 0.25, max: 0.4 },

  tempRangeC: { min: 10, max: 30 },

  nitrogenRequirement: "low",

  tosnaFactor: 0.75,

  notes: [
    "Extremely robust",
    "Restarts stuck fermentations",
    "Neutral profile",
    "Handles high sugar musts"
  ]
}
```

**Source highlights:**

- ~18% tolerance ([mr-malt.se][1])
- 0.25–0.4 g/L pitch rate ([maltmagnus.se][2])

---

### K1-V1116 (high ester + robust)

```ts
{
  brand: "Lallemand",
  name: "K1-V1116",
  type: "wine",

  alcoholTolerance: 18,
  pitchRateGPerL: { min: 0.2, max: 0.4 },

  tempRangeC: { min: 10, max: 35 },

  nitrogenRequirement: "medium",

  tosnaFactor: 0.9,

  notes: [
    "Very stress tolerant",
    "Handles poor nutrient environments",
    "Produces fruity esters",
    "Great for melomels"
  ]
}
```

**Source:**

- 18% tolerance, 0.2–0.4 g/L ([olbryggning.se][3])

---

### D47 (classic mead yeast, nutrient hungry)

```ts
{
  brand: "Lallemand",
  name: "D47",
  type: "wine",

  alcoholTolerance: 14,

  pitchRateGPerL: { min: 0.2, max: 0.4 },

  tempRangeC: { min: 15, max: 20 },

  nitrogenRequirement: "high",

  tosnaFactor: 1.25,

  notes: [
    "Full-bodied mouthfeel",
    "Needs nutrients (very important)",
    "Can produce sulfur if stressed",
    "Great for traditional meads"
  ]
}
```

**Source:**

- Explicit nutrient need noted ([bryggbolaget.se][4])

---

### 71B (fruit-forward, acid-reducing)

```ts
{
  brand: "Lallemand",
  name: "71B",
  type: "wine",

  alcoholTolerance: 14,

  pitchRateGPerL: { min: 0.2, max: 0.4 },

  tempRangeC: { min: 15, max: 30 },

  nitrogenRequirement: "medium",

  tosnaFactor: 0.9,

  notes: [
    "Metabolizes malic acid",
    "Enhances fruit character",
    "Good for melomels",
    "Lower alcohol ceiling"
  ]
}
```

---

### QA23 (aromatic white wine / clean meads)

```ts
{
  brand: "Lallemand",
  name: "QA23",
  type: "wine",

  alcoholTolerance: 16,

  pitchRateGPerL: { min: 0.2, max: 0.4 },

  tempRangeC: { min: 14, max: 28 },

  nitrogenRequirement: "low",

  tosnaFactor: 0.75,

  notes: [
    "Low nutrient requirement",
    "Enhances aromatic compounds",
    "Clean fermentation"
  ]
}
```

**Source:**

- Low nutrient need explicitly stated ([hembryggeriet.se][5])

---

### Premier Blanc (Red Star)

```ts
{
  brand: "Red Star",
  name: "Premier Blanc",
  type: "wine",

  alcoholTolerance: 18,

  pitchRateGPerL: { min: 0.2, max: 0.4 },

  tempRangeC: { min: 15, max: 30 },

  nitrogenRequirement: "low",

  tosnaFactor: 0.75,

  notes: [
    "Champagne-style yeast",
    "Clean, neutral",
    "High attenuation",
    "Good for high ABV meads"
  ]
}
```

---

## 🍺 Bonus (braggot crossover)

### US-05

```ts
{
  brand: "Fermentis",
  name: "US-05",
  type: "beer",

  alcoholTolerance: 11,

  pitchRateGPerL: { min: 0.5, max: 1.0 },

  tempRangeC: { min: 18, max: 28 },

  nitrogenRequirement: "medium",

  tosnaFactor: 0.9,

  notes: [
    "Clean ale profile",
    "Lower alcohol tolerance",
    "Good for braggots"
  ]
}
```

---

# ⚙️ TOSNA Mapping (this is the key abstraction)

You now have:

```ts
type NitrogenRequirement = "low" | "medium" | "high";

const TOSNA_FACTORS = {
  low: 0.75,
  medium: 0.9,
  high: 1.25,
};
```

---

# 🧠 Why this mapping works

Real-world interpretation:

| Yeast type              | Behavior            | TOSNA factor |
| ----------------------- | ------------------- | -----------: |
| EC-1118 / Premier Blanc | efficient, low need |         0.75 |
| K1-V1116 / 71B          | moderate need       |          0.9 |
| D47                     | nutrient hungry     |         1.25 |

This aligns with:

- manufacturer hints
- real brewing experience
- TOSNA philosophy

---

# 🧨 Important design decision

Allow override:

```ts
userOverride?: {
  nitrogenRequirement?: "low" | "medium" | "high";
}
```

Because:

> Advanced brewers will disagree with defaults sometimes.

---

# 🚀 What this unlocks in your app

Now you can:

### 1. Auto-TOSNA from yeast

No user thinking required.

---

### 2. Risk warnings

```ts
if (yeast.nitrogenRequirement === "high" && og > 1.11)
  warn("High nutrient demand + high OG → stall risk");
```

---

### 3. Smart suggestions

> “This yeast may struggle at this ABV — consider EC-1118”

---
