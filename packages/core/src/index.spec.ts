import { describe, expect, it } from 'vitest';
import {
  honeyOnlyPlannerInputSchema,
  planHoneyOnlyBatch,
  type HoneyOnlyPlannerResult,
} from './index';

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
