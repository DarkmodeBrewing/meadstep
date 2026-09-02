import { z } from 'zod';

const HONEY_GRAVITY_POINTS_PER_KG_PER_LITER = 290;
const HONEY_PPG = 35;
const HONEY_SUGAR_PERCENT = 82;
const ABV_POINTS_FACTOR = 131.25;
const ASSUMED_DRY_FINAL_GRAVITY = 1;
const LITERS_PER_US_GALLON = 3.785411784;
const KILOGRAMS_PER_POUND = 0.45359237;

export const MIN_CALCULATOR_GRAVITY = 0.9;
export const MAX_CALCULATOR_GRAVITY = 1.3;
export const MAX_CALCULATOR_ABV_PERCENT = 30;

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

export const honeyOriginalGravityInputSchema = z.object({
  honeyKg: z.number().positive(),
  volumeLiters: z.number().positive(),
});

export const honeyOriginalGravityResultSchema = z.object({
  honeyKg: z.number().positive(),
  volumeLiters: z.number().positive(),
  gravityPoints: z.number().positive(),
  estimatedOriginalGravity: z.number().positive(),
  estimatedBrix: z.number().positive(),
  potentialAbvPercent: z.number().nonnegative(),
  assumptions: z.object({
    honeyPpg: z.number().positive(),
    honeySugarPercent: z.number().positive(),
    honeyPointsPerKgPerLiter: z.number().positive(),
    finalGravity: z.number().positive(),
  }),
});

export const potentialAbvInputSchema = z
  .object({
    originalGravity: z.number().positive(),
    finalGravity: z.number().positive().default(ASSUMED_DRY_FINAL_GRAVITY),
  })
  .refine(
    ({ originalGravity, finalGravity }) => originalGravity >= finalGravity,
    {
      message:
        'Original gravity must be greater than or equal to final gravity.',
      path: ['finalGravity'],
    },
  );

const calculatorGravitySchema = z
  .number()
  .min(MIN_CALCULATOR_GRAVITY)
  .max(MAX_CALCULATOR_GRAVITY);

export const classicAbvInputSchema = z
  .object({
    originalGravity: calculatorGravitySchema,
    finalGravity: calculatorGravitySchema,
  })
  .refine(
    ({ originalGravity, finalGravity }) => originalGravity >= finalGravity,
    {
      message: 'Final gravity must not exceed original gravity.',
      path: ['finalGravity'],
    },
  )
  .refine(
    ({ originalGravity, finalGravity }) =>
      (originalGravity - finalGravity) * ABV_POINTS_FACTOR <=
      MAX_CALCULATOR_ABV_PERCENT,
    {
      message: `Calculated ABV must not exceed ${MAX_CALCULATOR_ABV_PERCENT}%.`,
      path: ['finalGravity'],
    },
  );

export const reverseAbvInputSchema = z
  .object({
    originalGravity: calculatorGravitySchema,
    targetAbvPercent: z.number().nonnegative().max(MAX_CALCULATOR_ABV_PERCENT),
  })
  .refine(
    ({ originalGravity, targetAbvPercent }) =>
      originalGravity - targetAbvPercent / ABV_POINTS_FACTOR >=
      MIN_CALCULATOR_GRAVITY,
    {
      message: `Target ABV implies a final gravity below ${MIN_CALCULATOR_GRAVITY.toFixed(3)}.`,
      path: ['targetAbvPercent'],
    },
  );

export type HoneyOriginalGravityInput = z.infer<
  typeof honeyOriginalGravityInputSchema
>;
export type HoneyOriginalGravityResult = z.infer<
  typeof honeyOriginalGravityResultSchema
>;
export type PotentialAbvInput = z.input<typeof potentialAbvInputSchema>;
export type ClassicAbvInput = z.infer<typeof classicAbvInputSchema>;
export type ReverseAbvInput = z.infer<typeof reverseAbvInputSchema>;

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

export function gravityToBrix(specificGravity: number): number {
  const gravity = z.number().positive().parse(specificGravity);

  return (
    182.4601 * gravity ** 3 -
    775.6821 * gravity ** 2 +
    1262.7794 * gravity -
    669.5622
  );
}

export function brixToGravity(brix: number): number {
  const value = z.number().nonnegative().parse(brix);

  return 1 + value / (258.6 - (value / 258.2) * 227.1);
}

export function estimatePotentialAbv(input: PotentialAbvInput): number {
  const validatedInput = potentialAbvInputSchema.parse(input);

  return (
    (validatedInput.originalGravity - validatedInput.finalGravity) *
    ABV_POINTS_FACTOR
  );
}

export function calculateAbv(input: ClassicAbvInput): number {
  const validatedInput = classicAbvInputSchema.parse(input);

  return (
    (validatedInput.originalGravity - validatedInput.finalGravity) *
    ABV_POINTS_FACTOR
  );
}

export function estimateFinalGravityForAbv(input: ReverseAbvInput): number {
  const validatedInput = reverseAbvInputSchema.parse(input);

  return (
    validatedInput.originalGravity -
    validatedInput.targetAbvPercent / ABV_POINTS_FACTOR
  );
}

export function estimateHoneyOriginalGravity(
  input: HoneyOriginalGravityInput,
): HoneyOriginalGravityResult {
  const validatedInput = honeyOriginalGravityInputSchema.parse(input);
  const gravityPoints =
    (validatedInput.honeyKg * HONEY_GRAVITY_POINTS_PER_KG_PER_LITER) /
    validatedInput.volumeLiters;
  const estimatedOriginalGravity = 1 + gravityPoints / 1000;

  return honeyOriginalGravityResultSchema.parse({
    ...validatedInput,
    gravityPoints,
    estimatedOriginalGravity,
    estimatedBrix: gravityToBrix(estimatedOriginalGravity),
    potentialAbvPercent: estimatePotentialAbv({
      originalGravity: estimatedOriginalGravity,
    }),
    assumptions: {
      honeyPpg: HONEY_PPG,
      honeySugarPercent: HONEY_SUGAR_PERCENT,
      honeyPointsPerKgPerLiter: HONEY_GRAVITY_POINTS_PER_KG_PER_LITER,
      finalGravity: ASSUMED_DRY_FINAL_GRAVITY,
    },
  });
}
