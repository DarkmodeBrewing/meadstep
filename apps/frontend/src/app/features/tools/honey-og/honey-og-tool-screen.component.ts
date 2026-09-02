import { Component, inject } from '@angular/core';
import { NoticesComponent } from '../../../shared/ui/notices.component';
import { UiFieldComponent } from '../../../shared/ui/field.component';
import { ResultRowsComponent } from '../../../shared/ui/result-rows.component';
import { UiSectionComponent } from '../../../shared/ui/section.component';
import { HoneyOgToolFacade } from './honey-og-tool.facade';

@Component({
  selector: 'app-honey-og-tool-screen',
  standalone: true,
  imports: [NoticesComponent, ResultRowsComponent, UiFieldComponent, UiSectionComponent],
  template: `
    <app-ui-section
      eyebrow="Standalone tool"
      title="Honey OG"
      description="Estimate original gravity from honey amount and final must volume."
    >
      <app-notices [notices]="facade.notices()" />
      <div class="controls" aria-label="Honey OG inputs">
        <app-ui-field
          fieldId="honey-kg"
          label="Honey"
          [value]="facade.honeyKg()"
          unit="kg"
          min="0"
          step="0.05"
          [error]="facade.fieldErrors().honeyKg"
          (valueChange)="facade.setHoneyKg($event)"
        />
        <app-ui-field
          fieldId="volume-liters"
          label="Must volume"
          [value]="facade.volumeLiters()"
          unit="L"
          min="0"
          step="0.25"
          [error]="facade.fieldErrors().volumeLiters"
          (valueChange)="facade.setVolumeLiters($event)"
        />
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
export class HoneyOgToolScreenComponent {
  protected readonly facade = inject(HoneyOgToolFacade);
}
