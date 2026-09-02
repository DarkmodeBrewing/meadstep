import { describe, expect, it } from 'vitest';
import {
  AUTOMATIC_INITIAL_OG_CAP,
  BUILT_IN_YEASTS,
  MAX_AUTOMATIC_STEP_FEEDS,
  PREFERRED_MAX_STEP_FEED_GRAMS_PER_LITER,
  calculateAbv,
  convertVolume,
  convertWeight,
  createCustomYeast,
  customYeastInputSchema,
  estimateFinalGravityForAbv,
  estimateHoneyOriginalGravity,
  estimatePotentialAbv,
  evaluatePlannerGravityWarnings,
  evaluateYeastTolerance,
  getBuiltInYeast,
  gravityToBrix,
  honeyOnlyPlannerInputSchema,
  planHoneyOnlyBatch,
  planHoneyOnlyBatchForUnitSystem,
  planStepFeedingSchedule,
  brixToGravity,
  type HoneyOnlyPlannerResult,
} from './index';

describe('unit conversions', () => {
  it('converts volumes between metric liters and US gallons', () => {
    expect(convertVolume(1, 'gallons', 'liters')).toBeCloseTo(3.785411784, 9);
    expect(convertVolume(3.785411784, 'liters', 'gallons')).toBeCloseTo(1, 9);
  });

  it('converts weights between metric kilograms and US pounds', () => {
    expect(convertWeight(1, 'pounds', 'kilograms')).toBeCloseTo(0.45359237, 9);
    expect(convertWeight(0.45359237, 'kilograms', 'pounds')).toBeCloseTo(1, 9);
  });
});

describe('planHoneyOnlyBatch', () => {
  it('keeps a normal-gravity batch entirely in the initial must', () => {
    const input = honeyOnlyPlannerInputSchema.parse({
      batchVolumeLiters: 5,
      targetAbvPercent: 12,
    });

    const result: HoneyOnlyPlannerResult = planHoneyOnlyBatch(input);

    expect(result.batchVolumeLiters).toBe(5);
    expect(result.targetAbvPercent).toBe(12);
    expect(result.initialOgMode).toBe('automatic');
    expect(result.totalHoneyKg).toBeCloseTo(1.58, 2);
    expect(result.initialHoneyKg).toBeCloseTo(result.totalHoneyKg, 9);
    expect(result.remainingHoneyKg).toBe(0);
    expect(result.stepFeedingSchedule.feeds).toEqual([]);
    expect(result.initialOriginalGravity).toBeCloseTo(1.091, 3);
    expect(result.totalEquivalentOriginalGravity).toBeCloseTo(1.091, 3);
    expect(result.estimatedFinalGravity).toBe(1);
    expect(result.estimatedAbvPercent).toBeCloseTo(12, 1);
    expect(result.gravityWarnings).toEqual([]);
  });

  it('caps automatic initial OG and reserves excess honey for step feeding', () => {
    const result = planHoneyOnlyBatch({
      batchVolumeLiters: 5,
      targetAbvPercent: 18,
    });

    expect(result.initialOriginalGravity).toBe(AUTOMATIC_INITIAL_OG_CAP);
    expect(result.totalEquivalentOriginalGravity).toBeCloseTo(1.137, 3);
    expect(result.initialHoneyKg).toBeCloseTo(1.897, 3);
    expect(result.totalHoneyKg).toBeCloseTo(2.365, 3);
    expect(result.remainingHoneyKg).toBeCloseTo(0.468, 3);
    expect(result.stepFeedingSchedule.feedCount).toBe(2);
    expect(result.stepFeedingSchedule.feeds[0]).toMatchObject({
      feedNumber: 1,
      approximateDay: 2,
      approximateDayLabel: 'Day 2',
    });
    expect(result.stepFeedingSchedule.feeds[0]?.honeyGrams).toBeCloseTo(234, 0);
    expect(result.stepFeedingSchedule.feeds[0]?.gravityMilestone).toBeCloseTo(
      1.096,
      3,
    );
    expect(result.gravityWarnings.map((warning) => warning.code)).toEqual([
      'initial_og_moderate',
      'total_og_strong',
    ]);
  });

  it('uses a manual initial pitch OG and recalculates the honey split', () => {
    const result = planHoneyOnlyBatch({
      batchVolumeLiters: 5,
      targetAbvPercent: 18,
      initialOgMode: 'manual',
      manualInitialOg: 1.095,
    });

    expect(result.initialOgMode).toBe('manual');
    expect(result.initialOriginalGravity).toBe(1.095);
    expect(result.initialHoneyKg).toBeCloseTo(1.638, 3);
    expect(result.remainingHoneyKg).toBeCloseTo(0.727, 3);
  });

  it('rejects missing or impossible manual initial OG values', () => {
    expect(() =>
      planHoneyOnlyBatch({
        batchVolumeLiters: 5,
        targetAbvPercent: 12,
        initialOgMode: 'manual',
      }),
    ).toThrow('Enter an initial pitch OG.');

    expect(() =>
      planHoneyOnlyBatch({
        batchVolumeLiters: 5,
        targetAbvPercent: 12,
        initialOgMode: 'manual',
        manualInitialOg: 1.11,
      }),
    ).toThrow(
      'Initial pitch OG cannot exceed the total equivalent OG of 1.091.',
    );
  });
});

describe('planStepFeedingSchedule', () => {
  it('returns an empty schedule when no honey remains', () => {
    const result = planStepFeedingSchedule({
      batchVolumeLiters: 5,
      remainingHoneyKg: 0,
      initialOriginalGravity: 1.091,
    });

    expect(result).toMatchObject({
      idealFeedCount: 0,
      feedCount: 0,
      feedHoneyGrams: 0,
      exceedsPreferredFeedSize: false,
      gravityMilestoneWasClamped: false,
      feeds: [],
      warnings: [],
    });
  });

  it('creates one feed at the gravity that refills to pitch OG', () => {
    const result = planStepFeedingSchedule({
      batchVolumeLiters: 5,
      remainingHoneyKg: 0.2,
      initialOriginalGravity: 1.11,
    });

    expect(result.preferredMaximumFeedGrams).toBe(
      5 * PREFERRED_MAX_STEP_FEED_GRAMS_PER_LITER,
    );
    expect(result.feedCount).toBe(1);
    expect(result.feeds[0]).toMatchObject({
      feedNumber: 1,
      honeyGrams: 200,
      approximateDay: 2,
      approximateDayLabel: 'Day 2',
    });
    expect(result.feeds[0]?.gravityContributionPoints).toBeCloseTo(11.6, 6);
    expect(result.feeds[0]?.gravityMilestone).toBeCloseTo(1.0984, 6);
  });

  it('creates equal multiple feeds with two-day guidance', () => {
    const result = planStepFeedingSchedule({
      batchVolumeLiters: 5,
      remainingHoneyKg: 0.6,
      initialOriginalGravity: 1.11,
    });

    expect(result.feedCount).toBe(3);
    expect(result.feeds.map((feed) => feed.honeyGrams)).toEqual([
      200, 200, 200,
    ]);
    expect(result.feeds.map((feed) => feed.approximateDayLabel)).toEqual([
      'Day 2',
      'Day 4',
      'Day 6',
    ]);
    expect(
      result.feeds.reduce((sum, feed) => sum + feed.honeyGrams, 0),
    ).toBeCloseTo(600, 9);
  });

  it('caps at four feeds and warns when each exceeds 50 g/L', () => {
    const result = planStepFeedingSchedule({
      batchVolumeLiters: 5,
      remainingHoneyKg: 2,
      initialOriginalGravity: 1.11,
    });

    expect(result.idealFeedCount).toBe(8);
    expect(result.feedCount).toBe(MAX_AUTOMATIC_STEP_FEEDS);
    expect(result.feedHoneyGrams).toBe(500);
    expect(result.exceedsPreferredFeedSize).toBe(true);
    expect(result.feeds.map((feed) => feed.approximateDay)).toEqual([
      2, 4, 6, 8,
    ]);
    expect(result.warnings.map((warning) => warning.code)).toEqual([
      'step_feed_cap_exceeded',
    ]);
  });

  it('clamps an impossible refill milestone to 1.000 and warns', () => {
    const result = planStepFeedingSchedule({
      batchVolumeLiters: 5,
      remainingHoneyKg: 2,
      initialOriginalGravity: 1.01,
    });

    expect(result.gravityMilestoneWasClamped).toBe(true);
    expect(result.feeds.every((feed) => feed.gravityMilestone === 1)).toBe(
      true,
    );
    expect(result.warnings.map((warning) => warning.code)).toEqual([
      'step_feed_cap_exceeded',
      'step_feed_refill_ceiling_unreachable',
    ]);
  });
});

describe('planHoneyOnlyBatchForUnitSystem', () => {
  it('preserves the same canonical batch plan for equivalent metric and US inputs', () => {
    const metricResult = planHoneyOnlyBatchForUnitSystem({
      unitSystem: 'metric',
      batchVolume: 5,
      targetAbvPercent: 12,
    });
    const usResult = planHoneyOnlyBatchForUnitSystem({
      unitSystem: 'us',
      batchVolume: 1.3208602617907,
      targetAbvPercent: 12,
    });

    expect(usResult.canonical.batchVolumeLiters).toBeCloseTo(
      metricResult.canonical.batchVolumeLiters,
      9,
    );
    expect(usResult.canonical.totalHoneyKg).toBeCloseTo(
      metricResult.canonical.totalHoneyKg,
      9,
    );
    expect(usResult.canonical.totalEquivalentOriginalGravity).toBeCloseTo(
      metricResult.canonical.totalEquivalentOriginalGravity,
      9,
    );

    expect(metricResult.display.batchVolume).toBeCloseTo(5, 9);
    expect(metricResult.display.batchVolumeUnit).toBe('liters');
    expect(metricResult.display.honeyWeightUnit).toBe('kilograms');
    expect(metricResult.display.totalHoneyWeight).toBeCloseTo(
      metricResult.canonical.totalHoneyKg,
      9,
    );
    expect(metricResult.display.remainingHoneyWeight).toBe(0);

    expect(usResult.display.batchVolume).toBeCloseTo(1.3208602617907, 9);
    expect(usResult.display.batchVolumeUnit).toBe('gallons');
    expect(usResult.display.honeyWeightUnit).toBe('pounds');
    expect(usResult.display.totalHoneyWeight).toBeCloseTo(3.48, 2);
  });
});

describe('planner gravity warnings', () => {
  it.each([
    [1.1, undefined],
    [1.101, 'initial_og_moderate'],
    [1.121, 'initial_og_high'],
    [1.141, 'initial_og_severe'],
  ] as const)('maps initial OG %s to %s', (initialOriginalGravity, code) => {
    const warnings = evaluatePlannerGravityWarnings({
      initialOriginalGravity,
      totalEquivalentOriginalGravity: Math.max(initialOriginalGravity, 1.12),
    });

    expect(
      warnings.find((warning) => warning.code.startsWith('initial_og'))?.code,
    ).toBe(code);
  });

  it.each([
    [1.12, undefined],
    [1.121, 'total_og_strong'],
    [1.151, 'total_og_high'],
    [1.181, 'total_og_extreme'],
  ] as const)(
    'maps total equivalent OG %s to %s',
    (totalEquivalentOriginalGravity, code) => {
      const warnings = evaluatePlannerGravityWarnings({
        initialOriginalGravity: 1.09,
        totalEquivalentOriginalGravity,
      });

      expect(
        warnings.find((warning) => warning.code.startsWith('total_og'))?.code,
      ).toBe(code);
    },
  );
});

describe('estimateHoneyOriginalGravity', () => {
  it('estimates honey OG, Brix/Plato, and potential ABV from canonical honey assumptions', () => {
    const result = estimateHoneyOriginalGravity({
      honeyKg: 1,
      volumeLiters: 5,
    });

    expect(result.honeyKg).toBe(1);
    expect(result.volumeLiters).toBe(5);
    expect(result.assumptions.honeyPointsPerKgPerLiter).toBe(290);
    expect(result.gravityPoints).toBeCloseTo(58, 2);
    expect(result.estimatedOriginalGravity).toBeCloseTo(1.058, 3);
    expect(result.estimatedBrix).toBeCloseTo(14.27, 2);
    expect(result.potentialAbvPercent).toBeCloseTo(7.6, 1);
  });

  it('rejects non-positive honey and volume values', () => {
    expect(() =>
      estimateHoneyOriginalGravity({ honeyKg: 0, volumeLiters: 5 }),
    ).toThrow();
    expect(() =>
      estimateHoneyOriginalGravity({ honeyKg: 1, volumeLiters: -1 }),
    ).toThrow();
  });
});

describe('gravity conversions', () => {
  it('converts specific gravity to Brix/Plato and back', () => {
    const brix = gravityToBrix(1.09);
    const gravity = brixToGravity(brix);

    expect(brix).toBeCloseTo(21.6, 1);
    expect(gravity).toBeCloseTo(1.09, 3);
  });

  it('estimates potential ABV from original and final gravity', () => {
    expect(estimatePotentialAbv({ originalGravity: 1.09 })).toBeCloseTo(
      11.8,
      1,
    );
    expect(
      estimatePotentialAbv({ originalGravity: 1.09, finalGravity: 1.01 }),
    ).toBeCloseTo(10.5, 1);
  });

  it('rejects a final gravity above the original gravity', () => {
    expect(() =>
      estimatePotentialAbv({ originalGravity: 1.01, finalGravity: 1.02 }),
    ).toThrow(
      'Original gravity must be greater than or equal to final gravity.',
    );

    expect(
      estimatePotentialAbv({ originalGravity: 1.01, finalGravity: 1.01 }),
    ).toBe(0);
  });
});

describe('ABV calculator', () => {
  it('calculates ABV from original and final gravity', () => {
    expect(
      calculateAbv({ originalGravity: 1.09, finalGravity: 1.01 }),
    ).toBeCloseTo(10.5, 1);
  });

  it('estimates final gravity from original gravity and target ABV', () => {
    expect(
      estimateFinalGravityForAbv({
        originalGravity: 1.09,
        targetAbvPercent: 10.5,
      }),
    ).toBeCloseTo(1.01, 3);
  });

  it('rejects out-of-range and physically invalid calculator inputs', () => {
    expect(() =>
      calculateAbv({ originalGravity: 1.31, finalGravity: 1.01 }),
    ).toThrow();
    expect(() =>
      calculateAbv({ originalGravity: 1.01, finalGravity: 1.02 }),
    ).toThrow('Final gravity must not exceed original gravity.');
    expect(() =>
      estimateFinalGravityForAbv({
        originalGravity: 1.05,
        targetAbvPercent: 30,
      }),
    ).toThrow('Target ABV implies a final gravity below 0.900.');
  });
});

describe('yeast selection and tolerance', () => {
  it('provides the seven curated MVP yeasts with EC-1118 as the baseline', () => {
    expect(BUILT_IN_YEASTS).toHaveLength(7);
    expect(getBuiltInYeast('ec-1118')).toMatchObject({
      name: 'EC-1118',
      alcoholTolerancePercent: 18,
      nitrogenRequirement: 'low',
    });
  });

  it('validates and normalizes custom yeast details', () => {
    expect(
      createCustomYeast({
        name: '  House Kveik  ',
        alcoholTolerancePercent: 13,
        nitrogenRequirement: 'high',
      }),
    ).toMatchObject({
      id: 'custom',
      name: 'House Kveik',
      alcoholTolerancePercent: 13,
      nitrogenRequirement: 'high',
    });

    expect(() =>
      customYeastInputSchema.parse({
        name: '',
        alcoholTolerancePercent: 31,
        nitrogenRequirement: 'medium',
      }),
    ).toThrow();
  });

  it.each([
    [12, 'normal', 'ok'],
    [12.1, 'moderate', 'warning'],
    [13.1, 'high', 'warning'],
    [14.1, 'severe', 'error'],
  ] as const)(
    'maps a %s%% target to %s tolerance state',
    (targetAbvPercent, level, noticeTone) => {
      const result = evaluateYeastTolerance({
        yeast: getBuiltInYeast('d47'),
        targetAbvPercent,
        totalEquivalentOg: 1.14,
      });

      expect(result.level).toBe(level);
      expect(result.noticeTone).toBe(noticeTone);
    },
  );

  it('adds a tolerance-limited FG hint only above listed tolerance', () => {
    const result = evaluateYeastTolerance({
      yeast: getBuiltInYeast('d47'),
      targetAbvPercent: 18,
      totalEquivalentOg: 1.14,
    });

    expect(result.estimatedToleranceLimitedFinalGravity).toBeCloseTo(1.033, 3);
    expect(result.message).toContain('FG may finish around 1.033');
    expect(result.action).toContain('higher-tolerance yeast');
  });
});
