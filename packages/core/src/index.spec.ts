import { describe, expect, it } from 'vitest';
import {
  convertVolume,
  convertWeight,
  honeyOnlyPlannerInputSchema,
  planHoneyOnlyBatch,
  planHoneyOnlyBatchForUnitSystem,
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
