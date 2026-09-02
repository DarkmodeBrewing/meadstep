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
export const CUSTOM_YEAST_ID = 'custom' as const;
export const DEFAULT_BUILT_IN_YEAST_ID = 'ec-1118' as const;

export const nitrogenRequirementSchema = z.enum(['low', 'medium', 'high']);
export const builtInYeastIdSchema = z.enum([
  'ec-1118',
  'k1-v1116',
  'd47',
  '71b',
  'qa23',
  'premier-blanc',
  'us-05',
]);
export const yeastSelectionIdSchema = z.union([
  builtInYeastIdSchema,
  z.literal(CUSTOM_YEAST_ID),
]);
export const yeastProfileSchema = z.object({
  id: z.string().min(1),
  brand: z.string().min(1),
  name: z.string().min(1),
  alcoholTolerancePercent: z
    .number()
    .positive()
    .max(MAX_CALCULATOR_ABV_PERCENT),
  nitrogenRequirement: nitrogenRequirementSchema,
});
export const builtInYeastProfileSchema = yeastProfileSchema.extend({
  id: builtInYeastIdSchema,
});
export const customYeastInputSchema = z.object({
  name: z.string().trim().min(1, 'Enter a yeast name.').max(80),
  alcoholTolerancePercent: z
    .number()
    .positive('Enter tolerance above 0%.')
    .max(
      MAX_CALCULATOR_ABV_PERCENT,
      `Enter tolerance up to ${MAX_CALCULATOR_ABV_PERCENT}%.`,
    ),
  nitrogenRequirement: nitrogenRequirementSchema,
});
export const yeastToleranceLevelSchema = z.enum([
  'normal',
  'moderate',
  'high',
  'severe',
]);
export const yeastToleranceNoticeToneSchema = z.enum([
  'ok',
  'warning',
  'error',
]);
export const yeastToleranceInputSchema = z.object({
  yeast: yeastProfileSchema,
  targetAbvPercent: z.number().positive().max(MAX_CALCULATOR_ABV_PERCENT),
  totalEquivalentOg: z
    .number()
    .min(MIN_CALCULATOR_GRAVITY)
    .max(MAX_CALCULATOR_GRAVITY),
});
export const yeastToleranceResultSchema = z.object({
  yeast: yeastProfileSchema,
  targetAbvPercent: z.number().positive(),
  toleranceMarginPercent: z.number(),
  level: yeastToleranceLevelSchema,
  noticeTone: yeastToleranceNoticeToneSchema,
  title: z.string().min(1),
  message: z.string().min(1),
  action: z.string().min(1),
  estimatedToleranceLimitedFinalGravity: z.number().nullable(),
});

export type NitrogenRequirement = z.infer<typeof nitrogenRequirementSchema>;
export type BuiltInYeastId = z.infer<typeof builtInYeastIdSchema>;
export type YeastSelectionId = z.infer<typeof yeastSelectionIdSchema>;
export type YeastProfile = z.infer<typeof yeastProfileSchema>;
export type BuiltInYeastProfile = z.infer<typeof builtInYeastProfileSchema>;
export type CustomYeastInput = z.infer<typeof customYeastInputSchema>;
export type YeastToleranceInput = z.infer<typeof yeastToleranceInputSchema>;
export type YeastToleranceResult = z.infer<typeof yeastToleranceResultSchema>;

export const BUILT_IN_YEASTS: readonly BuiltInYeastProfile[] = Object.freeze(
  builtInYeastProfileSchema.array().parse([
    {
      id: 'ec-1118',
      brand: 'Lallemand',
      name: 'EC-1118',
      alcoholTolerancePercent: 18,
      nitrogenRequirement: 'low',
    },
    {
      id: 'k1-v1116',
      brand: 'Lallemand',
      name: 'K1-V1116',
      alcoholTolerancePercent: 18,
      nitrogenRequirement: 'medium',
    },
    {
      id: 'd47',
      brand: 'Lallemand',
      name: 'D47',
      alcoholTolerancePercent: 14,
      nitrogenRequirement: 'high',
    },
    {
      id: '71b',
      brand: 'Lallemand',
      name: '71B',
      alcoholTolerancePercent: 14,
      nitrogenRequirement: 'medium',
    },
    {
      id: 'qa23',
      brand: 'Lallemand',
      name: 'QA23',
      alcoholTolerancePercent: 16,
      nitrogenRequirement: 'low',
    },
    {
      id: 'premier-blanc',
      brand: 'Red Star',
      name: 'Premier Blanc',
      alcoholTolerancePercent: 18,
      nitrogenRequirement: 'low',
    },
    {
      id: 'us-05',
      brand: 'Fermentis',
      name: 'US-05',
      alcoholTolerancePercent: 11,
      nitrogenRequirement: 'medium',
    },
  ]),
);

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
      finalGravityForAbv(originalGravity, targetAbvPercent) >=
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

  return finalGravityForAbv(
    validatedInput.originalGravity,
    validatedInput.targetAbvPercent,
  );
}

export function getBuiltInYeast(id: BuiltInYeastId): BuiltInYeastProfile {
  const validatedId = builtInYeastIdSchema.parse(id);
  const yeast = BUILT_IN_YEASTS.find(
    (candidate) => candidate.id === validatedId,
  );

  if (!yeast) {
    throw new Error(`Unknown built-in yeast: ${validatedId}`);
  }

  return yeast;
}

export function createCustomYeast(input: CustomYeastInput): YeastProfile {
  const validatedInput = customYeastInputSchema.parse(input);

  return yeastProfileSchema.parse({
    id: CUSTOM_YEAST_ID,
    brand: 'Custom',
    ...validatedInput,
  });
}

export function evaluateYeastTolerance(
  input: YeastToleranceInput,
): YeastToleranceResult {
  const validatedInput = yeastToleranceInputSchema.parse(input);
  const toleranceMarginPercent =
    validatedInput.yeast.alcoholTolerancePercent -
    validatedInput.targetAbvPercent;
  const shared = {
    yeast: validatedInput.yeast,
    targetAbvPercent: validatedInput.targetAbvPercent,
    toleranceMarginPercent,
  };

  if (toleranceMarginPercent >= 2) {
    return yeastToleranceResultSchema.parse({
      ...shared,
      level: 'normal',
      noticeTone: 'ok',
      title: 'Comfortable yeast tolerance margin',
      message: `${validatedInput.yeast.name} is listed for ${validatedInput.yeast.alcoholTolerancePercent.toFixed(1)}% ABV, ${toleranceMarginPercent.toFixed(1)}% above the target.`,
      action: 'Keep normal fermentation practices and nutrient support.',
      estimatedToleranceLimitedFinalGravity: null,
    });
  }

  if (toleranceMarginPercent >= 1) {
    return yeastToleranceResultSchema.parse({
      ...shared,
      level: 'moderate',
      noticeTone: 'warning',
      title: 'Narrow yeast tolerance margin',
      message: `${validatedInput.yeast.name} is only ${toleranceMarginPercent.toFixed(1)}% above the target ABV.`,
      action: 'Use healthy yeast handling and complete nutrient support.',
      estimatedToleranceLimitedFinalGravity: null,
    });
  }

  if (toleranceMarginPercent >= 0) {
    return yeastToleranceResultSchema.parse({
      ...shared,
      level: 'high',
      noticeTone: 'warning',
      title: 'Target is near yeast tolerance',
      message: `${validatedInput.targetAbvPercent.toFixed(1)}% ABV is within ${toleranceMarginPercent.toFixed(1)}% of ${validatedInput.yeast.name}'s listed tolerance.`,
      action: 'Watch fermentation closely and avoid additional stress.',
      estimatedToleranceLimitedFinalGravity: null,
    });
  }

  const estimatedToleranceLimitedFinalGravity = finalGravityForAbv(
    validatedInput.totalEquivalentOg,
    validatedInput.yeast.alcoholTolerancePercent,
  );

  return yeastToleranceResultSchema.parse({
    ...shared,
    level: 'severe',
    noticeTone: 'error',
    title: 'Target exceeds yeast tolerance',
    message: `${validatedInput.yeast.name} is listed for ${validatedInput.yeast.alcoholTolerancePercent.toFixed(1)}% ABV, ${Math.abs(toleranceMarginPercent).toFixed(1)}% below the target. If the yeast stops near its listed tolerance, FG may finish around ${estimatedToleranceLimitedFinalGravity.toFixed(3)}.`,
    action: 'Choose a higher-tolerance yeast or plan for residual sweetness.',
    estimatedToleranceLimitedFinalGravity,
  });
}

function finalGravityForAbv(
  originalGravity: number,
  targetAbvPercent: number,
): number {
  return originalGravity - targetAbvPercent / ABV_POINTS_FACTOR;
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
