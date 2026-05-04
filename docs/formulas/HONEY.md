For the calculator, I’d make this the **canonical default**:

## Canonical honey constant

| Property             |                                  Default |
| -------------------- | ---------------------------------------: |
| Sugar content        |      **82% fermentable sugar by weight** |
| Water content        |                                  **18%** |
| Gravity contribution |                               **35 PPG** |
| Metric equivalent    | **~290 gravity points per kg per litre** |

That means:

```text
Gravity points = (honey_kg × 290) / volume_L
OG = 1 + (points / 1000)
```

Example:

```text
1 kg honey in 5 L:
points = (1 × 290) / 5
points = 58

Estimated OG = 1.058
```

This lines up with the common mead/brewing rule that **1 lb honey in 1 US gallon gives about 35 gravity points**, and with honey being roughly **82% carbohydrate / 17–18% water**. ([MeadMakr][1])

For the app, I’d expose it like this:

| Mode                     |                       Value |
| ------------------------ | --------------------------: |
| Standard honey           |          35 PPG / 82% sugar |
| Dry/high-moisture honey  |                   33–34 PPG |
| Dense/low-moisture honey |                   36–37 PPG |
| Custom                   | user-defined sugar % or PPG |

So internally:

```ts
const DEFAULT_HONEY_PPG = 35;
const DEFAULT_HONEY_SUGAR_PERCENT = 82;
const DEFAULT_HONEY_POINTS_PER_KG_PER_L = 290;
```

For monster meads, I’d also add a note:

> “Honey varies. Measure actual OG after mixing if precision matters.”

Canonical default: **35 PPG / 82% sugar / 290 points·L⁻¹·kg⁻¹**.

[1]: https://www.meadmakr.com/just-how-much-honey-is-in-mead/?utm_source=chatgpt.com "Just How Much Honey Is in Mead?"
