import { Component, inject } from '@angular/core';
import { ResultRowsComponent } from '../../../shared/ui/result-rows.component';
import { UiFieldComponent } from '../../../shared/ui/field.component';
import { UiSectionComponent } from '../../../shared/ui/section.component';
import { ToggleGroupComponent } from '../../../shared/ui/toggle-group.component';
import type { ToggleOption } from '../../../shared/ui/ui.models';
import { AbvToolFacade, type AbvMode } from './abv-tool.facade';

@Component({
  selector: 'app-abv-tool-screen',
  standalone: true,
  imports: [ResultRowsComponent, ToggleGroupComponent, UiFieldComponent, UiSectionComponent],
  template: `
    <app-ui-section
      eyebrow="Standalone tool"
      title="ABV calculator"
      description="Calculate ABV from gravity readings or estimate the FG needed for a target ABV."
    >
      <app-toggle-group
        idPrefix="abv-mode"
        label="Calculation"
        [options]="modeOptions"
        [value]="facade.mode()"
        (valueChange)="facade.setMode($event)"
      />
      <div class="controls" aria-label="ABV inputs">
        <app-ui-field
          fieldId="abv-og"
          label="Original gravity"
          [value]="facade.originalGravity()"
          unit="OG"
          min="0.9"
          max="1.3"
          step="0.001"
          [error]="facade.fieldErrors().originalGravity"
          (valueChange)="facade.setOriginalGravity($event)"
        />
        @if (facade.mode() === 'classic') {
          <app-ui-field
            fieldId="abv-fg"
            label="Final gravity"
            [value]="facade.finalGravity()"
            unit="FG"
            min="0.9"
            max="1.3"
            step="0.001"
            [error]="facade.fieldErrors().finalGravity"
            (valueChange)="facade.setFinalGravity($event)"
          />
        } @else {
          <app-ui-field
            fieldId="abv-target"
            label="Target ABV"
            [value]="facade.targetAbvPercent()"
            unit="%"
            min="0"
            max="30"
            step="0.1"
            [error]="facade.fieldErrors().targetAbvPercent"
            (valueChange)="facade.setTargetAbvPercent($event)"
          />
        }
      </div>
      @if (facade.hasErrors()) {
        <p class="empty-result" role="status">Enter valid values to see the result.</p>
      } @else {
        <app-result-rows [rows]="facade.resultRows()" />
      }
    </app-ui-section>
  `,
  styles: `
    .controls {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .empty-result {
      min-height: 4rem;
      margin: 0 0 1rem;
      padding: 1rem;
      border: 1px dashed var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      color: var(--muted);
      font-weight: 700;
    }
  `,
})
export class AbvToolScreenComponent {
  protected readonly facade = inject(AbvToolFacade);
  protected readonly modeOptions: ToggleOption<AbvMode>[] = [
    { label: 'OG + FG to ABV', value: 'classic' },
    { label: 'OG + ABV to FG', value: 'reverse' },
  ];
}
