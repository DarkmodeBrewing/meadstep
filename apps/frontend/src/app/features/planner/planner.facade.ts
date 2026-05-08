import { computed, inject, Injectable, signal } from '@angular/core';
import { convertVolume, planHoneyOnlyBatchForUnitSystem, type UnitSystem } from '@meadstep/core';
import { PreferencesService } from '../../shared/preferences/preferences.service';
import type { ResultRow } from '../../shared/ui/ui.models';

@Injectable({ providedIn: 'root' })
export class PlannerFacade {
  private readonly preferences = inject(PreferencesService);

  readonly batchVolume = signal(5);
  readonly targetAbvPercent = signal(12);
  readonly unitSystem = this.preferences.unitSystem;

  readonly result = computed(() =>
    planHoneyOnlyBatchForUnitSystem({
      unitSystem: this.unitSystem(),
      batchVolume: this.batchVolume(),
      targetAbvPercent: this.targetAbvPercent(),
    }),
  );

  readonly volumeUnit = computed(() =>
    this.result().display.batchVolumeUnit === 'gallons' ? 'gal' : 'L',
  );

  readonly resultRows = computed<ResultRow[]>(() => {
    const display = this.result().display;
    const honeyUnit = display.honeyWeightUnit === 'pounds' ? 'lb' : 'kg';

    return [
      {
        label: 'Honey needed',
        value: `${display.honeyWeight.toFixed(2)} ${honeyUnit}`,
      },
      {
        label: 'Estimated OG',
        value: display.estimatedOriginalGravity.toFixed(3),
      },
      {
        label: 'Estimated FG',
        value: display.estimatedFinalGravity.toFixed(3),
      },
      {
        label: 'Estimated ABV',
        value: `${display.estimatedAbvPercent.toFixed(1)}%`,
      },
    ];
  });

  readonly plannerOutput = computed(() => {
    const result = this.result();
    const honeyNeeded = this.resultRows()[0]?.value ?? '';

    return [
      '# MeadStep honey-only plan',
      `Batch volume: ${result.display.batchVolume.toFixed(2)} ${this.volumeUnit()}`,
      `Honey needed: ${honeyNeeded}`,
      `Estimated OG: ${result.display.estimatedOriginalGravity.toFixed(3)}`,
      `Estimated FG: ${result.display.estimatedFinalGravity.toFixed(3)}`,
      `Estimated ABV: ${result.display.estimatedAbvPercent.toFixed(1)}%`,
    ].join('\n');
  });

  setBatchVolume(value: number): void {
    if (Number.isFinite(value) && value > 0) {
      this.batchVolume.set(value);
    }
  }

  setTargetAbvPercent(value: number): void {
    if (Number.isFinite(value) && value > 0) {
      this.targetAbvPercent.set(value);
    }
  }

  setUnitSystem(unitSystem: UnitSystem): void {
    const currentUnitSystem = this.unitSystem();

    if (currentUnitSystem !== unitSystem) {
      const current = this.batchVolume();
      const nextBatchVolume =
        unitSystem === 'us'
          ? convertVolume(current, 'liters', 'gallons')
          : convertVolume(current, 'gallons', 'liters');

      this.batchVolume.set(nextBatchVolume);
      this.preferences.setUnitSystem(unitSystem);
    }
  }
}
