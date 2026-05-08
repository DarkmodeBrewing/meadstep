import { Component, inject } from '@angular/core';
import { UiFieldComponent } from '../../shared/ui/field.component';
import { ResultRowsComponent } from '../../shared/ui/result-rows.component';
import { UiSectionComponent } from '../../shared/ui/section.component';
import { ToggleGroupComponent } from '../../shared/ui/toggle-group.component';
import type { ToggleOption } from '../../shared/ui/ui.models';
import { PlannerFacade } from './planner.facade';
import type { UnitSystem } from '@meadstep/core';

@Component({
  selector: 'app-planner-screen',
  standalone: true,
  imports: [ResultRowsComponent, ToggleGroupComponent, UiFieldComponent, UiSectionComponent],
  template: `
    <app-ui-section
      eyebrow="Honey-only planner"
      title="MeadStep"
      description="Build a quick honey-only batch plan from volume and target ABV."
    >
      <app-toggle-group
        idPrefix="unit-system"
        label="Units"
        [options]="unitOptions"
        [value]="facade.unitSystem()"
        (valueChange)="facade.setUnitSystem($event)"
      />
      <div class="controls" aria-label="Planner inputs">
        <app-ui-field
          fieldId="batch-volume"
          label="Batch volume"
          [value]="facade.batchVolume()"
          [unit]="facade.volumeUnit()"
          min="1"
          step="0.25"
          (valueChange)="facade.setBatchVolume($event)"
        />
        <app-ui-field
          fieldId="target-abv-percent"
          label="Target ABV"
          [value]="facade.targetAbvPercent()"
          unit="%"
          min="1"
          max="20"
          step="0.5"
          (valueChange)="facade.setTargetAbvPercent($event)"
        />
      </div>
      <app-result-rows [rows]="facade.resultRows()" />
      <section class="plan-output" aria-label="Generated planner output">
        <h2>Brew plan</h2>
        <pre id="planner-output">{{ facade.plannerOutput() }}</pre>
      </section>
    </app-ui-section>
  `,
  styles: `
    .controls {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .plan-output h2 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
    }

    pre {
      overflow-x: auto;
      margin: 0;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      font: inherit;
      line-height: 1.5;
      white-space: pre-wrap;
    }
  `,
})
export class PlannerScreenComponent {
  protected readonly facade = inject(PlannerFacade);
  protected readonly unitOptions: ToggleOption<UnitSystem>[] = [
    { label: 'Metric', value: 'metric' },
    { label: 'US', value: 'us' },
  ];
}
