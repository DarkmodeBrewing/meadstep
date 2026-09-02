import { computed, Injectable, signal } from '@angular/core';
import { estimateHoneyOriginalGravity } from '@meadstep/core';
import type { Notice } from '../../../shared/notices/notice.model';
import type { ResultRow } from '../../../shared/ui/ui.models';

export interface HoneyOgFieldErrors {
  honeyKg?: string;
  volumeLiters?: string;
}

@Injectable({ providedIn: 'root' })
export class HoneyOgToolFacade {
  readonly honeyKg = signal(1);
  readonly volumeLiters = signal(5);

  readonly fieldErrors = computed<HoneyOgFieldErrors>(() => {
    const errors: HoneyOgFieldErrors = {};

    if (!Number.isFinite(this.honeyKg()) || this.honeyKg() <= 0) {
      errors.honeyKg = 'Enter more than 0 kg honey.';
    }

    if (!Number.isFinite(this.volumeLiters()) || this.volumeLiters() <= 0) {
      errors.volumeLiters = 'Enter more than 0 L volume.';
    }

    return errors;
  });

  readonly result = computed(() => {
    if (Object.keys(this.fieldErrors()).length > 0) {
      return undefined;
    }

    return estimateHoneyOriginalGravity({
      honeyKg: this.honeyKg(),
      volumeLiters: this.volumeLiters(),
    });
  });

  readonly resultRows = computed<ResultRow[]>(() => {
    const result = this.result();

    if (!result) {
      return [];
    }

    return [
      {
        label: 'Estimated OG',
        value: result.estimatedOriginalGravity.toFixed(3),
      },
      {
        label: 'Brix / Plato',
        value: `${result.estimatedBrix.toFixed(1)} Brix`,
      },
      {
        label: 'Potential ABV',
        value: `${result.potentialAbvPercent.toFixed(1)}%`,
      },
      {
        label: 'Gravity points',
        value: result.gravityPoints.toFixed(0),
      },
    ];
  });

  readonly notices = computed<Notice[]>(() => [
    {
      tone: 'info',
      title: 'Default honey assumption',
      message: 'Uses 35 PPG / 82% sugar / 290 gravity points per kg per litre.',
    },
    {
      tone: 'warning',
      title: 'Honey varies',
      message: 'Measure actual OG after mixing if precision matters; measured OG should win.',
    },
  ]);

  setHoneyKg(value: number): void {
    this.honeyKg.set(value);
  }

  setVolumeLiters(value: number): void {
    this.volumeLiters.set(value);
  }
}
