import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { convertVolume, planHoneyOnlyBatchForUnitSystem, type UnitSystem } from '@meadstep/core';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('MeadStep');
  protected readonly unitSystem = signal<UnitSystem>('metric');
  protected readonly batchVolume = signal(5);
  protected readonly targetAbvPercent = signal(12);

  protected readonly plannerResult = computed(() =>
    planHoneyOnlyBatchForUnitSystem({
      unitSystem: this.unitSystem(),
      batchVolume: this.batchVolume(),
      targetAbvPercent: this.targetAbvPercent(),
    }),
  );
  protected readonly plannerOutput = computed(() => {
    const result = this.plannerResult();

    return [
      '# MeadStep honey-only plan',
      `Batch volume: ${result.display.batchVolume.toFixed(2)} ${this.formatVolumeUnit()}`,
      `Honey needed: ${this.formatHoneyWeight()}`,
      `Estimated OG: ${this.formatGravity(result.display.estimatedOriginalGravity)}`,
      `Estimated FG: ${this.formatGravity(result.display.estimatedFinalGravity)}`,
      `Estimated ABV: ${this.formatPercent(result.display.estimatedAbvPercent)}`,
    ].join('\n');
  });

  protected setUnitSystem(unitSystem: UnitSystem): void {
    const currentUnitSystem = this.unitSystem();

    if (currentUnitSystem !== unitSystem) {
      const nextBatchVolume =
        unitSystem === 'us'
          ? convertVolume(this.batchVolume(), 'liters', 'gallons')
          : convertVolume(this.batchVolume(), 'gallons', 'liters');

      this.batchVolume.set(nextBatchVolume);
      this.unitSystem.set(unitSystem);
    }
  }

  protected formatVolumeUnit(): string {
    return this.plannerResult().display.batchVolumeUnit === 'gallons' ? 'gal' : 'L';
  }

  protected formatHoneyWeight(): string {
    const display = this.plannerResult().display;
    const unit = display.honeyWeightUnit === 'pounds' ? 'lb' : 'kg';

    return `${display.honeyWeight.toFixed(2)} ${unit}`;
  }

  protected formatGravity(value: number): string {
    return value.toFixed(3);
  }

  protected formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}
