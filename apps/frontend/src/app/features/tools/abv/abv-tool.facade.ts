import { computed, Injectable, signal } from '@angular/core';
import {
  calculateAbv,
  classicAbvInputSchema,
  estimateFinalGravityForAbv,
  MAX_CALCULATOR_ABV_PERCENT,
  MAX_CALCULATOR_GRAVITY,
  MIN_CALCULATOR_GRAVITY,
  reverseAbvInputSchema,
} from '@meadstep/core';
import type { ResultRow } from '../../../shared/ui/ui.models';

export type AbvMode = 'classic' | 'reverse';

export interface AbvFieldErrors {
  originalGravity?: string;
  finalGravity?: string;
  targetAbvPercent?: string;
}

function gravityRangeError(value: number, label: 'OG' | 'FG'): string | undefined {
  if (!Number.isFinite(value) || value < MIN_CALCULATOR_GRAVITY || value > MAX_CALCULATOR_GRAVITY) {
    return `Enter ${label} from ${MIN_CALCULATOR_GRAVITY.toFixed(3)} to ${MAX_CALCULATOR_GRAVITY.toFixed(3)}.`;
  }

  return undefined;
}

@Injectable({ providedIn: 'root' })
export class AbvToolFacade {
  readonly mode = signal<AbvMode>('classic');
  readonly originalGravity = signal(1.09);
  readonly finalGravity = signal(1.01);
  readonly targetAbvPercent = signal(10.5);

  readonly fieldErrors = computed<AbvFieldErrors>(() => {
    const errors: AbvFieldErrors = {};
    const originalGravityError = gravityRangeError(this.originalGravity(), 'OG');

    if (originalGravityError) {
      errors.originalGravity = originalGravityError;
    }

    if (this.mode() === 'classic') {
      const finalGravityError = gravityRangeError(this.finalGravity(), 'FG');

      if (finalGravityError) {
        errors.finalGravity = finalGravityError;
      }

      if (!originalGravityError && !finalGravityError) {
        const parsed = classicAbvInputSchema.safeParse({
          originalGravity: this.originalGravity(),
          finalGravity: this.finalGravity(),
        });

        if (!parsed.success) {
          const [issue] = parsed.error.issues;

          if (issue) {
            errors.finalGravity = issue.message;
          }
        }
      }
    } else {
      if (
        !Number.isFinite(this.targetAbvPercent()) ||
        this.targetAbvPercent() < 0 ||
        this.targetAbvPercent() > MAX_CALCULATOR_ABV_PERCENT
      ) {
        errors.targetAbvPercent = `Enter target ABV from 0% to ${MAX_CALCULATOR_ABV_PERCENT}%.`;
      }

      if (!originalGravityError && !errors.targetAbvPercent) {
        const parsed = reverseAbvInputSchema.safeParse({
          originalGravity: this.originalGravity(),
          targetAbvPercent: this.targetAbvPercent(),
        });

        if (!parsed.success) {
          const [issue] = parsed.error.issues;

          if (issue) {
            errors.targetAbvPercent = issue.message;
          }
        }
      }
    }

    return errors;
  });

  readonly hasErrors = computed(() => Object.keys(this.fieldErrors()).length > 0);

  readonly resultRows = computed<ResultRow[]>(() => {
    if (this.hasErrors()) {
      return [];
    }

    if (this.mode() === 'classic') {
      return [
        {
          label: 'Estimated ABV',
          value: `${calculateAbv({
            originalGravity: this.originalGravity(),
            finalGravity: this.finalGravity(),
          }).toFixed(1)}%`,
          helper: 'Standard estimate using the 131.25 gravity-point factor.',
        },
      ];
    }

    return [
      {
        label: 'Estimated FG',
        value: estimateFinalGravityForAbv({
          originalGravity: this.originalGravity(),
          targetAbvPercent: this.targetAbvPercent(),
        }).toFixed(3),
        helper: `From ${this.originalGravity().toFixed(3)} OG at ${this.targetAbvPercent().toFixed(1)}% ABV.`,
      },
    ];
  });

  setMode(mode: AbvMode): void {
    this.mode.set(mode);
  }

  setOriginalGravity(value: number): void {
    this.originalGravity.set(value);
  }

  setFinalGravity(value: number): void {
    this.finalGravity.set(value);
  }

  setTargetAbvPercent(value: number): void {
    this.targetAbvPercent.set(value);
  }
}
