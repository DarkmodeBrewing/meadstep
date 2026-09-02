import { computed, Injectable, signal } from '@angular/core';
import { brixToGravity, gravityToBrix } from '@meadstep/core';
import type { ResultRow } from '../../../shared/ui/ui.models';

export type GravityMode = 'sg-to-brix' | 'brix-to-sg';

export interface GravityFieldErrors {
  specificGravity?: string;
  brix?: string;
}

@Injectable({ providedIn: 'root' })
export class GravityToolFacade {
  readonly mode = signal<GravityMode>('sg-to-brix');
  readonly specificGravity = signal(1.09);
  readonly brix = signal(21.6);

  readonly fieldErrors = computed<GravityFieldErrors>(() => {
    const errors: GravityFieldErrors = {};

    if (
      this.mode() === 'sg-to-brix' &&
      (!Number.isFinite(this.specificGravity()) || this.specificGravity() < 1)
    ) {
      errors.specificGravity = 'Enter SG of 1.000 or higher.';
    }

    if (this.mode() === 'brix-to-sg' && (!Number.isFinite(this.brix()) || this.brix() < 0)) {
      errors.brix = 'Enter 0 or more Brix.';
    }

    return errors;
  });

  readonly resultRows = computed<ResultRow[]>(() => {
    if (Object.keys(this.fieldErrors()).length > 0) {
      return [];
    }

    if (this.mode() === 'sg-to-brix') {
      return [
        {
          label: 'Brix / Plato',
          value: `${gravityToBrix(this.specificGravity()).toFixed(1)} Brix`,
        },
      ];
    }

    return [
      {
        label: 'Specific gravity',
        value: `${brixToGravity(this.brix()).toFixed(3)} SG`,
      },
    ];
  });

  setMode(mode: GravityMode): void {
    this.mode.set(mode);
  }

  setSpecificGravity(value: number): void {
    this.specificGravity.set(value);
  }

  setBrix(value: number): void {
    this.brix.set(value);
  }
}
