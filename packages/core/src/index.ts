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
export const AUTOMATIC_INITIAL_OG_CAP = 1.11;
export const MIN_INITIAL_OG = 1.001;
export const PREFERRED_MAX_STEP_FEED_GRAMS_PER_LITER = 50;
export const MAX_AUTOMATIC_STEP_FEEDS = 4;
export const STEP_FEED_DAY_INTERVAL = 2;
export const MIN_STEP_FEED_GRAVITY_MILESTONE = 1;
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

function addManualInitialOgIssues(
  input: {
    targetAbvPercent: number;
    initialOgMode: 'automatic' | 'manual';
    manualInitialOg?: number;
  },
  context: {
    addIssue(issue: { code: 'custom'; path: string[]; message: string }): void;
  },
): void {
  if (input.initialOgMode !== 'manual') {
    return;
  }

  if (input.manualInitialOg === undefined) {
    context.addIssue({
      code: 'custom',
      path: ['manualInitialOg'],
      message: 'Enter an initial pitch OG.',
    });
    return;
  }

  const totalEquivalentOriginalGravity =
    ASSUMED_DRY_FINAL_GRAVITY + input.targetAbvPercent / ABV_POINTS_FACTOR;

  if (input.manualInitialOg > totalEquivalentOriginalGravity) {
    context.addIssue({
      code: 'custom',
      path: ['manualInitialOg'],
      message: `Initial pitch OG cannot exceed the total equivalent OG of ${totalEquivalentOriginalGravity.toFixed(3)}.`,
    });
  }
}

export const initialOgModeSchema = z.enum(['automatic', 'manual']);
export const plannerGravityWarningCodeSchema = z.enum([
  'initial_og_moderate',
  'initial_og_high',
  'initial_og_severe',
  'total_og_strong',
  'total_og_high',
  'total_og_extreme',
]);
export const plannerGravityWarningSchema = z.object({
  code: plannerGravityWarningCodeSchema,
  severity: z.enum(['warning', 'error']),
  title: z.string().min(1),
  message: z.string().min(1),
  action: z.string().min(1),
});

export const stepFeedWarningCodeSchema = z.enum([
  'step_feed_cap_exceeded',
  'step_feed_refill_ceiling_unreachable',
]);
export const stepFeedWarningSchema = z.object({
  code: stepFeedWarningCodeSchema,
  severity: z.literal('warning'),
  title: z.string().min(1),
  message: z.string().min(1),
  action: z.string().min(1),
});
export const stepFeedInputSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  remainingHoneyKg: z.number().nonnegative(),
  initialOriginalGravity: z
    .number()
    .min(MIN_STEP_FEED_GRAVITY_MILESTONE)
    .max(MAX_CALCULATOR_GRAVITY),
});
export const stepFeedSchema = z.object({
  feedNumber: z.number().int().positive().max(MAX_AUTOMATIC_STEP_FEEDS),
  honeyGrams: z.number().positive(),
  gravityContributionPoints: z.number().positive(),
  gravityMilestone: z
    .number()
    .min(MIN_STEP_FEED_GRAVITY_MILESTONE)
    .max(MAX_CALCULATOR_GRAVITY),
  approximateDay: z.number().int().positive(),
  approximateDayLabel: z.string().min(1),
});
export const stepFeedPlanResultSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  remainingHoneyKg: z.number().nonnegative(),
  initialOriginalGravity: z.number().positive(),
  preferredMaximumFeedGrams: z.number().positive(),
  idealFeedCount: z.number().int().nonnegative(),
  feedCount: z.number().int().nonnegative().max(MAX_AUTOMATIC_STEP_FEEDS),
  feedHoneyGrams: z.number().nonnegative(),
  exceedsPreferredFeedSize: z.boolean(),
  gravityMilestoneWasClamped: z.boolean(),
  feeds: stepFeedSchema.array().max(MAX_AUTOMATIC_STEP_FEEDS),
  warnings: stepFeedWarningSchema.array(),
});

export const honeyOnlyPlannerInputSchema = z
  .object({
    batchVolumeLiters: z.number().positive('Enter a batch volume above 0.'),
    targetAbvPercent: z
      .number()
      .positive('Enter target ABV above 0%.')
      .max(20, 'Enter target ABV up to 20%.'),
    initialOgMode: initialOgModeSchema.default('automatic'),
    manualInitialOg: z
      .number()
      .min(MIN_INITIAL_OG, 'Enter an initial pitch OG from 1.001 to 1.300.')
      .max(
        MAX_CALCULATOR_GRAVITY,
        'Enter an initial pitch OG from 1.001 to 1.300.',
      )
      .optional(),
  })
  .superRefine(addManualInitialOgIssues);

export const honeyOnlyPlannerResultSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  targetAbvPercent: z.number().positive().max(20),
  initialOgMode: initialOgModeSchema,
  automaticInitialOgCap: z.number().positive(),
  initialOriginalGravity: z.number().positive(),
  totalEquivalentOriginalGravity: z.number().positive(),
  totalHoneyKg: z.number().positive(),
  initialHoneyKg: z.number().positive(),
  remainingHoneyKg: z.number().nonnegative(),
  estimatedFinalGravity: z.number().positive(),
  estimatedAbvPercent: z.number().positive(),
  gravityWarnings: plannerGravityWarningSchema.array(),
  stepFeedingSchedule: stepFeedPlanResultSchema,
});

export type InitialOgMode = z.infer<typeof initialOgModeSchema>;
export type PlannerGravityWarning = z.infer<typeof plannerGravityWarningSchema>;
export type StepFeedWarning = z.infer<typeof stepFeedWarningSchema>;
export type StepFeedInput = z.infer<typeof stepFeedInputSchema>;
export type StepFeed = z.infer<typeof stepFeedSchema>;
export type StepFeedPlanResult = z.infer<typeof stepFeedPlanResultSchema>;
export type HoneyOnlyPlannerInput = z.input<typeof honeyOnlyPlannerInputSchema>;
export type HoneyOnlyPlannerResult = z.infer<
  typeof honeyOnlyPlannerResultSchema
>;

export const honeyOnlyPlannerUnitSystemInputSchema = z
  .object({
    unitSystem: unitSystemSchema,
    batchVolume: z.number().positive('Enter a batch volume above 0.'),
    targetAbvPercent: z
      .number()
      .positive('Enter target ABV above 0%.')
      .max(20, 'Enter target ABV up to 20%.'),
    initialOgMode: initialOgModeSchema.default('automatic'),
    manualInitialOg: z
      .number()
      .min(MIN_INITIAL_OG, 'Enter an initial pitch OG from 1.001 to 1.300.')
      .max(
        MAX_CALCULATOR_GRAVITY,
        'Enter an initial pitch OG from 1.001 to 1.300.',
      )
      .optional(),
  })
  .superRefine(addManualInitialOgIssues);

export const honeyOnlyPlannerUnitSystemResultSchema = z.object({
  unitSystem: unitSystemSchema,
  canonical: honeyOnlyPlannerResultSchema,
  display: z.object({
    batchVolume: z.number().positive(),
    batchVolumeUnit: volumeUnitSchema,
    totalHoneyWeight: z.number().positive(),
    initialHoneyWeight: z.number().positive(),
    remainingHoneyWeight: z.number().nonnegative(),
    honeyWeightUnit: weightUnitSchema,
    initialOriginalGravity: z.number().positive(),
    totalEquivalentOriginalGravity: z.number().positive(),
    estimatedFinalGravity: z.number().positive(),
    estimatedAbvPercent: z.number().positive(),
  }),
});

export type HoneyOnlyPlannerUnitSystemInput = z.input<
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
  const totalEquivalentOriginalGravity =
    ASSUMED_DRY_FINAL_GRAVITY + gravityPoints / 1000;
  const initialOriginalGravity =
    validatedInput.initialOgMode === 'manual'
      ? validatedInput.manualInitialOg!
      : Math.min(totalEquivalentOriginalGravity, AUTOMATIC_INITIAL_OG_CAP);
  const totalHoneyKg = honeyKgForGravityPoints(
    gravityPoints,
    validatedInput.batchVolumeLiters,
  );
  const initialHoneyKg =
    initialOriginalGravity === totalEquivalentOriginalGravity
      ? totalHoneyKg
      : honeyKgForGravityPoints(
          (initialOriginalGravity - ASSUMED_DRY_FINAL_GRAVITY) * 1000,
          validatedInput.batchVolumeLiters,
        );
  const remainingHoneyKg = Math.max(totalHoneyKg - initialHoneyKg, 0);
  const estimatedAbvPercent =
    (totalEquivalentOriginalGravity - ASSUMED_DRY_FINAL_GRAVITY) *
    ABV_POINTS_FACTOR;

  return honeyOnlyPlannerResultSchema.parse({
    batchVolumeLiters: validatedInput.batchVolumeLiters,
    targetAbvPercent: validatedInput.targetAbvPercent,
    initialOgMode: validatedInput.initialOgMode,
    automaticInitialOgCap: AUTOMATIC_INITIAL_OG_CAP,
    initialOriginalGravity,
    totalEquivalentOriginalGravity,
    totalHoneyKg,
    initialHoneyKg,
    remainingHoneyKg,
    estimatedFinalGravity: ASSUMED_DRY_FINAL_GRAVITY,
    estimatedAbvPercent,
    gravityWarnings: evaluatePlannerGravityWarnings({
      initialOriginalGravity,
      totalEquivalentOriginalGravity,
    }),
    stepFeedingSchedule: planStepFeedingSchedule({
      batchVolumeLiters: validatedInput.batchVolumeLiters,
      remainingHoneyKg,
      initialOriginalGravity,
    }),
  });
}

export function planStepFeedingSchedule(
  input: StepFeedInput,
): StepFeedPlanResult {
  const validatedInput = stepFeedInputSchema.parse(input);
  const preferredMaximumFeedGrams =
    PREFERRED_MAX_STEP_FEED_GRAMS_PER_LITER * validatedInput.batchVolumeLiters;
  const remainingHoneyGrams = validatedInput.remainingHoneyKg * 1000;

  if (remainingHoneyGrams <= Number.EPSILON) {
    return stepFeedPlanResultSchema.parse({
      ...validatedInput,
      preferredMaximumFeedGrams,
      idealFeedCount: 0,
      feedCount: 0,
      feedHoneyGrams: 0,
      exceedsPreferredFeedSize: false,
      gravityMilestoneWasClamped: false,
      feeds: [],
      warnings: [],
    });
  }

  const idealFeedCount = Math.ceil(
    remainingHoneyGrams / preferredMaximumFeedGrams,
  );
  const feedCount = Math.min(idealFeedCount, MAX_AUTOMATIC_STEP_FEEDS);
  const feedHoneyGrams = remainingHoneyGrams / feedCount;
  const feedGramsPerLiter = feedHoneyGrams / validatedInput.batchVolumeLiters;
  const exceedsPreferredFeedSize = idealFeedCount > MAX_AUTOMATIC_STEP_FEEDS;
  const gravityContributionPoints =
    ((feedHoneyGrams / 1000) * HONEY_GRAVITY_POINTS_PER_KG_PER_LITER) /
    validatedInput.batchVolumeLiters;
  const rawGravityMilestone =
    validatedInput.initialOriginalGravity - gravityContributionPoints / 1000;
  const gravityMilestone = Math.max(
    rawGravityMilestone,
    MIN_STEP_FEED_GRAVITY_MILESTONE,
  );
  const gravityMilestoneWasClamped =
    rawGravityMilestone < MIN_STEP_FEED_GRAVITY_MILESTONE;
  const warnings: StepFeedWarning[] = [];

  if (exceedsPreferredFeedSize) {
    warnings.push({
      code: 'step_feed_cap_exceeded',
      severity: 'warning',
      title: 'Feed size exceeds the preferred limit',
      message: `Capping the schedule at four feeds makes each feed ${feedGramsPerLiter.toFixed(1)} g/L, above the preferred 50 g/L.`,
      action:
        'Add each feed only at its gravity milestone, mix thoroughly, and monitor fermentation response.',
    });
  }

  if (gravityMilestoneWasClamped) {
    warnings.push({
      code: 'step_feed_refill_ceiling_unreachable',
      severity: 'warning',
      title: 'Pitch OG cannot be restored at this feed size',
      message:
        'The must would need to fall below 1.000 SG for this feed to return it to the selected initial pitch OG.',
      action:
        'Review the initial OG or feed plan before brewing; 1.000 is shown as a safety floor.',
    });
  }

  const feeds: StepFeed[] = Array.from({ length: feedCount }, (_, index) => {
    const feedNumber = index + 1;
    const approximateDay = feedNumber * STEP_FEED_DAY_INTERVAL;

    return {
      feedNumber,
      honeyGrams: feedHoneyGrams,
      gravityContributionPoints,
      gravityMilestone,
      approximateDay,
      approximateDayLabel: `Day ${approximateDay}`,
    };
  });

  return stepFeedPlanResultSchema.parse({
    ...validatedInput,
    preferredMaximumFeedGrams,
    idealFeedCount,
    feedCount,
    feedHoneyGrams,
    exceedsPreferredFeedSize,
    gravityMilestoneWasClamped,
    feeds,
    warnings,
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
    initialOgMode: validatedInput.initialOgMode,
    manualInitialOg: validatedInput.manualInitialOg,
  });
  const displayWeight = (kilograms: number) =>
    isUs ? convertWeight(kilograms, 'kilograms', 'pounds') : kilograms;

  return honeyOnlyPlannerUnitSystemResultSchema.parse({
    unitSystem: validatedInput.unitSystem,
    canonical,
    display: {
      batchVolume: validatedInput.batchVolume,
      batchVolumeUnit: isUs ? 'gallons' : 'liters',
      totalHoneyWeight: displayWeight(canonical.totalHoneyKg),
      initialHoneyWeight: displayWeight(canonical.initialHoneyKg),
      remainingHoneyWeight: displayWeight(canonical.remainingHoneyKg),
      honeyWeightUnit: isUs ? 'pounds' : 'kilograms',
      initialOriginalGravity: canonical.initialOriginalGravity,
      totalEquivalentOriginalGravity: canonical.totalEquivalentOriginalGravity,
      estimatedFinalGravity: canonical.estimatedFinalGravity,
      estimatedAbvPercent: canonical.estimatedAbvPercent,
    },
  });
}

export function evaluatePlannerGravityWarnings(input: {
  initialOriginalGravity: number;
  totalEquivalentOriginalGravity: number;
}): PlannerGravityWarning[] {
  const validatedInput = z
    .object({
      initialOriginalGravity: z
        .number()
        .gt(ASSUMED_DRY_FINAL_GRAVITY)
        .max(MAX_CALCULATOR_GRAVITY),
      totalEquivalentOriginalGravity: z
        .number()
        .gt(ASSUMED_DRY_FINAL_GRAVITY)
        .max(MAX_CALCULATOR_GRAVITY),
    })
    .refine(
      ({ initialOriginalGravity, totalEquivalentOriginalGravity }) =>
        initialOriginalGravity <= totalEquivalentOriginalGravity,
      { message: 'Initial OG cannot exceed total equivalent OG.' },
    )
    .parse(input);
  const warnings: PlannerGravityWarning[] = [];
  const initialOg = validatedInput.initialOriginalGravity;
  const totalOg = validatedInput.totalEquivalentOriginalGravity;

  if (initialOg > 1.14) {
    warnings.push({
      code: 'initial_og_severe',
      severity: 'error',
      title: 'Severe initial gravity stress',
      message: `An initial OG of ${initialOg.toFixed(3)} carries a high fermentation stall risk.`,
      action:
        'Lower the initial pitch OG and reserve more honey for step feeding.',
    });
  } else if (initialOg > 1.12) {
    warnings.push({
      code: 'initial_og_high',
      severity: 'warning',
      title: 'High initial gravity',
      message: `An initial OG of ${initialOg.toFixed(3)} will put substantial osmotic stress on the yeast.`,
      action:
        'Step feeding is strongly recommended; use a healthy pitch and full nutrient support.',
    });
  } else if (initialOg > 1.1) {
    warnings.push({
      code: 'initial_og_moderate',
      severity: 'warning',
      title: 'Elevated initial gravity',
      message: `An initial OG of ${initialOg.toFixed(3)} is above the normal mead range.`,
      action:
        'Use a strong yeast pitch, oxygenation, and complete nutrient support.',
    });
  }

  if (totalOg > 1.18) {
    warnings.push({
      code: 'total_og_extreme',
      severity: 'error',
      title: 'Extreme total fermentable load',
      message: `The total equivalent OG is ${totalOg.toFixed(3)}, an experimental-strength mead.`,
      action: 'Confirm the target ABV and yeast tolerance before brewing.',
    });
  } else if (totalOg > 1.15) {
    warnings.push({
      code: 'total_og_high',
      severity: 'warning',
      title: 'High total fermentable load',
      message: `The total equivalent OG is ${totalOg.toFixed(3)}, in high-gravity or sack-mead territory.`,
      action:
        'Plan careful step feeding and monitor yeast health throughout fermentation.',
    });
  } else if (totalOg > 1.12) {
    warnings.push({
      code: 'total_og_strong',
      severity: 'warning',
      title: 'Strong-mead fermentable load',
      message: `The total equivalent OG is ${totalOg.toFixed(3)}.`,
      action:
        'Use a suitable yeast and reserve the calculated remaining honey for step feeding.',
    });
  }

  return plannerGravityWarningSchema.array().parse(warnings);
}

function honeyKgForGravityPoints(
  gravityPoints: number,
  batchVolumeLiters: number,
): number {
  return (
    (gravityPoints * batchVolumeLiters) / HONEY_GRAVITY_POINTS_PER_KG_PER_LITER
  );
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
