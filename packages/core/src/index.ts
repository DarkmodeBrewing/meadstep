import { z } from 'zod';

const HONEY_GRAVITY_POINTS_PER_KG_PER_LITER = 290;
const ABV_POINTS_FACTOR = 131.25;
const ASSUMED_DRY_FINAL_GRAVITY = 1;

export const honeyOnlyPlannerInputSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  targetAbvPercent: z.number().positive().max(20),
});

export const honeyOnlyPlannerResultSchema = z.object({
  batchVolumeLiters: z.number().positive(),
  targetAbvPercent: z.number().positive(),
  honeyKg: z.number().positive(),
  estimatedOriginalGravity: z.number().positive(),
  estimatedFinalGravity: z.number().positive(),
  estimatedAbvPercent: z.number().positive(),
});

export type HoneyOnlyPlannerInput = z.infer<typeof honeyOnlyPlannerInputSchema>;
export type HoneyOnlyPlannerResult = z.infer<
  typeof honeyOnlyPlannerResultSchema
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
