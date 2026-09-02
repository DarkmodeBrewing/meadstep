import { Component, ElementRef, inject, viewChild } from '@angular/core';
import type { NitrogenRequirement, UnitSystem, YeastSelectionId } from '@meadstep/core';
import { NoticesComponent } from '../../shared/ui/notices.component';
import { UiFieldComponent } from '../../shared/ui/field.component';
import { ResultRowsComponent } from '../../shared/ui/result-rows.component';
import { SelectFieldComponent } from '../../shared/ui/select-field.component';
import { UiSectionComponent } from '../../shared/ui/section.component';
import { TextFieldComponent } from '../../shared/ui/text-field.component';
import { ToggleGroupComponent } from '../../shared/ui/toggle-group.component';
import type { SelectOption, ToggleOption } from '../../shared/ui/ui.models';
import { PlannerFacade } from './planner.facade';

@Component({
  selector: 'app-planner-screen',
  standalone: true,
  imports: [
    NoticesComponent,
    ResultRowsComponent,
    SelectFieldComponent,
    TextFieldComponent,
    ToggleGroupComponent,
    UiFieldComponent,
    UiSectionComponent,
  ],
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
        <app-select-field
          fieldId="yeast-selection"
          label="Yeast"
          [value]="facade.selectedYeastId()"
          [options]="facade.yeastOptions"
          [helper]="facade.selectedYeastHelper()"
          (valueChange)="selectYeast($event)"
        />
      </div>

      <details #advanced class="advanced">
        <summary>Advanced</summary>
        @if (facade.selectedYeastId() === 'custom') {
          <div class="controls custom-yeast" aria-label="Custom yeast inputs">
            <app-text-field
              fieldId="custom-yeast-name"
              label="Custom yeast name"
              [value]="facade.customYeastName()"
              [error]="facade.customYeastFieldErrors().name"
              (valueChange)="facade.setCustomYeastName($event)"
            />
            <app-ui-field
              fieldId="custom-yeast-tolerance"
              label="Alcohol tolerance"
              [value]="facade.customYeastTolerancePercent()"
              unit="%"
              min="0.1"
              max="30"
              step="0.5"
              [error]="facade.customYeastFieldErrors().alcoholTolerancePercent"
              (valueChange)="facade.setCustomYeastTolerancePercent($event)"
            />
            <app-select-field
              fieldId="custom-yeast-nitrogen"
              label="Nitrogen requirement"
              [value]="facade.customYeastNitrogenRequirement()"
              [options]="nitrogenOptions"
              (valueChange)="facade.setCustomYeastNitrogenRequirement($event)"
            />
          </div>
        } @else {
          <p>Choose “Custom yeast…” above to enter your own tolerance and nitrogen requirement.</p>
        }
      </details>

      <div class="inline-notices" aria-label="Yeast tolerance notice">
        <app-notices [notices]="facade.yeastNotices()" />
      </div>
      <app-result-rows [rows]="facade.resultRows()" />

      @if (facade.summaryNotices().length) {
        <section class="notice-summary" aria-label="Active worksheet summary">
          <h2>Active worksheet notices</h2>
          <app-notices [notices]="facade.summaryNotices()" />
        </section>
      }

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

    .advanced {
      margin: 0 0 1rem;
      padding: 0.875rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    .advanced summary {
      cursor: pointer;
      font-weight: 800;
    }

    .advanced p {
      margin: 0.75rem 0 0;
      color: var(--muted);
      line-height: 1.4;
    }

    .custom-yeast {
      margin: 0.75rem 0 0;
    }

    .notice-summary h2,
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
  private readonly advancedDetails = viewChild<ElementRef<HTMLDetailsElement>>('advanced');
  protected readonly facade = inject(PlannerFacade);
  protected readonly unitOptions: ToggleOption<UnitSystem>[] = [
    { label: 'Metric', value: 'metric' },
    { label: 'US', value: 'us' },
  ];
  protected readonly nitrogenOptions: SelectOption<NitrogenRequirement>[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
  ];

  protected selectYeast(yeastId: YeastSelectionId): void {
    this.facade.setSelectedYeastId(yeastId);

    if (yeastId === 'custom') {
      this.advancedDetails()?.nativeElement.setAttribute('open', '');
    }
  }
}
