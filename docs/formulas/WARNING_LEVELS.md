I’d use **three warning layers**: initial OG stress, total planned OG, and yeast tolerance margin.

## 1. Initial OG stress warning

This is the gravity the yeast sees at pitch.

|  Initial OG | Risk level | Message                                |
| ----------: | ---------- | -------------------------------------- |
|     ≤ 1.100 | Low        | Normal mead range                      |
| 1.101–1.120 | Moderate   | Use strong pitch + nutrients           |
| 1.121–1.140 | High       | Step feeding strongly recommended      |
|     > 1.140 | Severe     | High stall risk unless very controlled |

For step-fed meads, this is the most important one. I’d try to keep initial OG around:

```text
1.090–1.110 for strong meads
1.100–1.120 max for experienced users
```

## 2. Total planned OG warning

This is the theoretical OG if all honey were added at once.

| Total equivalent OG | Risk                     |
| ------------------: | ------------------------ |
|             ≤ 1.120 | Normal                   |
|         1.121–1.150 | Strong mead territory    |
|         1.151–1.180 | High-gravity / sack mead |
|             > 1.180 | Extreme / experimental   |

This should not block the user, just label the batch honestly.

## 3. Yeast tolerance risk

Compare target ABV to yeast alcohol tolerance.

```ts
const toleranceMargin = yeastToleranceAbv - targetAbv;
```

|                   Margin | Risk                                        |
| -----------------------: | ------------------------------------------- |
|   ≥ 2.0% below tolerance | Low                                         |
| 1.0–1.9% below tolerance | Moderate                                    |
|   0–0.9% below tolerance | High                                        |
|   Above listed tolerance | Severe / likely residual sweetness or stall |

Example:

| Yeast tolerance | Target ABV | Result   |
| --------------: | ---------: | -------- |
|             18% |        15% | Low risk |
|             18% |      16.5% | Moderate |
|             18% |      17.5% | High     |
|             18% |        19% | Severe   |

## Recommended defaults for app

```ts
const INITIAL_OG_WARNINGS = {
  moderate: 1.100,
  high: 1.120,
  severe: 1.140,
};

const TOTAL_OG_WARNINGS = {
  strong: 1.120,
  highGravity: 1.150,
  extreme: 1.180,
};

const YEAST_TOLERANCE_MARGIN_WARNINGS = {
  moderate: 2.0,
  high: 1.0,
  severe: 0.0,
};
```

Best practical rule:

> Warn hard when **initial OG > 1.120** or target ABV is within **1% of yeast tolerance**.

That’s where mead starts getting spicy in the bad way.
