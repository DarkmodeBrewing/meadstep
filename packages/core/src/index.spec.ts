import { describe, expect, it } from 'vitest';
import {
  convertVolume,
  convertWeight,
  estimateHoneyOriginalGravity,
  estimatePotentialAbv,
  gravityToBrix,
  honeyOnlyPlannerInputSchema,
  planHoneyOnlyBatch,
  planHoneyOnlyBatchForUnitSystem,
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
  it('validates inputs and plans a minimal honey-only batch from target ABV', () => {
    const input = honeyOnlyPlannerInputSchema.parse({
      batchVolumeLiters: 5,
      targetAbvPercent: 12,
    });

    const result: HoneyOnlyPlannerResult = planHoneyOnlyBatch(input);

    expect(result.batchVolumeLiters).toBe(5);
    expect(result.targetAbvPercent).toBe(12);
    expect(result.honeyKg).toBeCloseTo(1.58, 2);
    expect(result.estimatedOriginalGravity).toBeCloseTo(1.091, 3);
    expect(result.estimatedFinalGravity).toBe(1);
    expect(result.estimatedAbvPercent).toBeCloseTo(12, 1);
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
    expect(usResult.canonical.honeyKg).toBeCloseTo(
      metricResult.canonical.honeyKg,
      9,
    );
    expect(usResult.canonical.estimatedOriginalGravity).toBeCloseTo(
      metricResult.canonical.estimatedOriginalGravity,
      9,
    );

    expect(metricResult.display.batchVolume).toBeCloseTo(5, 9);
    expect(metricResult.display.batchVolumeUnit).toBe('liters');
    expect(metricResult.display.honeyWeightUnit).toBe('kilograms');
    expect(metricResult.display.honeyWeight).toBeCloseTo(
      metricResult.canonical.honeyKg,
      9,
    );

    expect(usResult.display.batchVolume).toBeCloseTo(1.3208602617907, 9);
    expect(usResult.display.batchVolumeUnit).toBe('gallons');
    expect(usResult.display.honeyWeightUnit).toBe('pounds');
    expect(usResult.display.honeyWeight).toBeCloseTo(3.48, 2);
  });
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
