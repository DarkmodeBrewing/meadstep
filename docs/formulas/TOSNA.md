The common **TOSNA 2.0 / Fermaid-O** formula is:

```text
Total Fermaid-O (g) =
((((Brix × 10) × Nitrogen Requirement Factor) / 50) × Volume in gallons)
```

Nitrogen requirement factors:

| Yeast N need | Factor |
| ------------ | -----: |
| Low          |   0.75 |
| Medium       |   0.90 |
| High         |   1.25 |

Then split total Fermaid-O into **4 additions**:

| Addition | Timing               |
| -------- | -------------------- |
| 1        | 24 hours after pitch |
| 2        | 48 hours after pitch |
| 3        | 72 hours after pitch |
| 4        | At 1/3 sugar break   |

This formula and schedule are listed by Mead Made Right for Fermaid-O nutrient additions. ([Mead Made Right][1])

Metric version:

```text
Volume_gal = Volume_L / 3.78541

Total_FermaidO_g =
((((Brix × 10) × N_Factor) / 50) × Volume_gal)

Per_Addition_g = Total_FermaidO_g / 4
```

Example, 5 L, 24 Brix, medium nitrogen yeast:

```text
Volume_gal = 5 / 3.78541 = 1.321

Total = ((((24 × 10) × 0.90) / 50) × 1.321)
Total = 5.71 g Fermaid-O

Per addition = 1.43 g
```

One important note for the calculator: TOSNA uses **starting Brix**, not final ABV directly. For step-feeding, we probably want two modes:

```text
Mode 1: TOSNA based only on initial must Brix
Mode 2: TOSNA based on total planned fermentable load
```

For high-gravity step-fed monsters, I’d expose that choice clearly.

[1]: https://www.meadmaderight.com/nutrient-additions?utm_source=chatgpt.com "Nutrient Additions"
