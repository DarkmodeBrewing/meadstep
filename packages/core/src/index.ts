import { z } from 'zod';

const HONEY_GRAVITY_POINTS_PER_KG_PER_LITER = 290;
const ABV_POINTS_FACTOR = 131.25;
const ASSUMED_DRY_FINAL_GRAVITY = 1;
const LITERS_PER_US_GALLON = 3.785411784;
const KILOGRAMS_PER_POUND = 0.45359237;

export const volumeUnitSchema = z.enum(['liters', 'gallons']);
export const weightUnitSchema = z.enum(['kilograms', 'pounds']);
export const unitSystemSchema = z.enum(['metric', 'us']);

export type VolumeUnit = z.infer<typeof volumeUnitSchema>;
export type WeightUnit = z.infer<typeof weightUnitSchema>;
export type UnitSystem = z.infer<typeof unitSystemSchema>;

export function convertVolume(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit,
): number {
  const liters =
    volumeUnitSchema.parse(from) === 'gallons'
      ? value * LITERS_PER_US_GALLON
      : value;

  return volumeUnitSchema.parse(to) === 'gallons'
    ? liters / LITERS_PER_US_GALLON
    : liters;
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number {
  const kilograms =
    weightUnitSchema.parse(from) === 'pounds'
      ? value * KILOGRAMS_PER_POUND
      : value;

  return weightUnitSchema.parse(to) === 'pounds'
    ? kilograms / KILOGRAMS_PER_POUND
    : kilograms;
}

export const honeyOnlyPlannerInputSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  targetAbvPercent: z.number().positive().max(20),
});

export const honeyOnlyPlannerResultSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  targetAbvPercent: z.number().positive().max(20),
  honeyKg: z.number().positive(),
  estimatedOriginalGravity: z.number().positive(),
  estimatedFinalGravity: z.number().positive(),
  estimatedAbvPercent: z.number().positive(),
});

export type HoneyOnlyPlannerInput = z.infer<typeof honeyOnlyPlannerInputSchema>;
export type HoneyOnlyPlannerResult = z.infer<
  typeof honeyOnlyPlannerResultSchema
>;

export const honeyOnlyPlannerUnitSystemInputSchema = z.object({
  unitSystem: unitSystemSchema,
  batchVolume: z.number().positive(),
  targetAbvPercent: z.number().positive().max(20),
});

export const honeyOnlyPlannerUnitSystemResultSchema = z.object({
  unitSystem: unitSystemSchema,
  canonical: honeyOnlyPlannerResultSchema,
  display: z.object({
    batchVolume: z.number().positive(),
    batchVolumeUnit: volumeUnitSchema,
    honeyWeight: z.number().positive(),
    honeyWeightUnit: weightUnitSchema,
    estimatedOriginalGravity: z.number().positive(),
    estimatedFinalGravity: z.number().positive(),
    estimatedAbvPercent: z.number().positive(),
  }),
});

export type HoneyOnlyPlannerUnitSystemInput = z.infer<
  typeof honeyOnlyPlannerUnitSystemInputSchema
>;
export type HoneyOnlyPlannerUnitSystemResult = z.infer<
  typeof honeyOnlyPlannerUnitSystemResultSchema
>;

export function planHoneyOnlyBatch(
  input: HoneyOnlyPlannerInput,
): HoneyOnlyPlannerResult {
  const validatedInput = honeyOnlyPlannerInputSchema.parse(input);
  const gravityPoints =
    (validatedInput.targetAbvPercent / ABV_POINTS_FACTOR) * 1000;
  const honeyKg =
    (gravityPoints * validatedInput.batchVolumeLiters) /
    HONEY_GRAVITY_POINTS_PER_KG_PER_LITER;
  const estimatedOriginalGravity =
    ASSUMED_DRY_FINAL_GRAVITY + gravityPoints / 1000;
  const estimatedAbvPercent =
    (estimatedOriginalGravity - ASSUMED_DRY_FINAL_GRAVITY) * ABV_POINTS_FACTOR;

  return honeyOnlyPlannerResultSchema.parse({
    ...validatedInput,
    honeyKg,
    estimatedOriginalGravity,
    estimatedFinalGravity: ASSUMED_DRY_FINAL_GRAVITY,
    estimatedAbvPercent,
  });
}

export function planHoneyOnlyBatchForUnitSystem(
  input: HoneyOnlyPlannerUnitSystemInput,
): HoneyOnlyPlannerUnitSystemResult {
  const validatedInput = honeyOnlyPlannerUnitSystemInputSchema.parse(input);
  const isUs = validatedInput.unitSystem === 'us';
  const batchVolumeLiters = isUs
    ? convertVolume(validatedInput.batchVolume, 'gallons', 'liters')
    : validatedInput.batchVolume;
  const canonical = planHoneyOnlyBatch({
    batchVolumeLiters,
    targetAbvPercent: validatedInput.targetAbvPercent,
  });

  return honeyOnlyPlannerUnitSystemResultSchema.parse({
    unitSystem: validatedInput.unitSystem,
    canonical,
    display: {
      batchVolume: validatedInput.batchVolume,
      batchVolumeUnit: isUs ? 'gallons' : 'liters',
      honeyWeight: isUs
        ? convertWeight(canonical.honeyKg, 'kilograms', 'pounds')
        : canonical.honeyKg,
      honeyWeightUnit: isUs ? 'pounds' : 'kilograms',
      estimatedOriginalGravity: canonical.estimatedOriginalGravity,
      estimatedFinalGravity: canonical.estimatedFinalGravity,
      estimatedAbvPercent: canonical.estimatedAbvPercent,
    },
  });
}
