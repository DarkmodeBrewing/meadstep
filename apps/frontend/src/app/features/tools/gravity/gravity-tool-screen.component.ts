import { Component, inject } from '@angular/core';
import { UiFieldComponent } from '../../../shared/ui/field.component';
import { ResultRowsComponent } from '../../../shared/ui/result-rows.component';
import { UiSectionComponent } from '../../../shared/ui/section.component';
import { ToggleGroupComponent } from '../../../shared/ui/toggle-group.component';
import type { ToggleOption } from '../../../shared/ui/ui.models';
import { GravityToolFacade, type GravityMode } from './gravity-tool.facade';

@Component({
  selector: 'app-gravity-tool-screen',
  standalone: true,
  imports: [ResultRowsComponent, ToggleGroupComponent, UiFieldComponent, UiSectionComponent],
  template: `
    <app-ui-section
      eyebrow="Standalone tool"
      title="Gravity"
      description="Convert between specific gravity and Brix/Plato."
    >
      <app-toggle-group
        idPrefix="mode"
        label="Conversion"
        [options]="modeOptions"
        [value]="facade.mode()"
        (valueChange)="facade.setMode($event)"
      />
      <div class="controls" aria-label="Gravity inputs">
        @if (facade.mode() === 'sg-to-brix') {
          <app-ui-field
            fieldId="sg-value"
            label="Specific gravity"
            [value]="facade.specificGravity()"
            unit="SG"
            min="1"
            step="0.001"
            [error]="facade.fieldErrors().specificGravity"
            (valueChange)="facade.setSpecificGravity($event)"
          />
        } @else {
          <app-ui-field
            fieldId="brix-value"
            label="Brix / Plato"
            [value]="facade.brix()"
            unit="Brix"
            min="0"
            step="0.1"
            [error]="facade.fieldErrors().brix"
            (valueChange)="facade.setBrix($event)"
          />
        }
      </div>
      <app-result-rows [rows]="facade.resultRows()" />
    </app-ui-section>
  `,
  styles: `
    .controls {
      display: grid;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
  `,
})
export class GravityToolScreenComponent {
  protected readonly facade = inject(GravityToolFacade);
  protected readonly modeOptions: ToggleOption<GravityMode>[] = [
    { label: 'SG to Brix', value: 'sg-to-brix' },
    { label: 'Brix to SG', value: 'brix-to-sg' },
  ];
}
