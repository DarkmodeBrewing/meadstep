import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { planHoneyOnlyBatch } from '@meadstep/core';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('MeadStep');
  protected readonly batchVolumeLiters = signal(5);
  protected readonly targetAbvPercent = signal(12);

  protected readonly plannerResult = computed(() =>
    planHoneyOnlyBatch({
      batchVolumeLiters: this.batchVolumeLiters(),
      targetAbvPercent: this.targetAbvPercent(),
    }),
  );

  protected formatKg(value: number): string {
    return `${value.toFixed(2)} kg`;
  }

  protected formatGravity(value: number): string {
    return value.toFixed(3);
  }

  protected formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
  }
}
