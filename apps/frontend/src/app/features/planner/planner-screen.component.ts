import { Component, ElementRef, inject, viewChild } from '@angular/core';
import type {
  InitialOgMode,
  NitrogenRequirement,
  UnitSystem,
  YeastSelectionId,
} from '@meadstep/core';
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
      description="Build a practical initial must from batch volume, target ABV, and yeast."
    >
      <div class="worksheet">
        <div class="input-column">
          <section class="worksheet-section" aria-labelledby="setup-heading">
            <header class="section-heading">
              <p>Step 1</p>
              <h2 id="setup-heading">Setup</h2>
            </header>

            <app-toggle-group
              idPrefix="unit-system"
              label="Units"
              [options]="unitOptions"
              [value]="facade.setupViewModel().unitSystem"
              (valueChange)="facade.setUnitSystem($event)"
            />

            <div class="controls" aria-label="Planner inputs">
              <app-ui-field
                fieldId="batch-volume"
                label="Batch volume"
                [value]="facade.setupViewModel().batchVolume"
                [unit]="facade.setupViewModel().volumeUnit"
                min="0.25"
                step="0.25"
                [error]="facade.fieldErrors().batchVolume"
                (valueChange)="facade.setBatchVolume($event)"
              />
              <app-ui-field
                fieldId="target-abv-percent"
                label="Target ABV"
                [value]="facade.setupViewModel().targetAbvPercent"
                unit="%"
                min="0.1"
                max="20"
                step="0.5"
                [error]="facade.fieldErrors().targetAbvPercent"
                (valueChange)="facade.setTargetAbvPercent($event)"
              />
              <app-select-field
                fieldId="yeast-selection"
                label="Yeast"
                [value]="facade.selectedYeastId()"
                [options]="facade.yeastOptions"
                [helper]="facade.setupViewModel().selectedYeastHelper"
                (valueChange)="selectYeast($event)"
              />
            </div>

            <div class="inline-notices" aria-label="Yeast tolerance notice">
              <app-notices [notices]="facade.yeastNotices()" />
            </div>

            <details #advanced class="advanced">
              <summary>Advanced</summary>

              <div class="advanced-content">
                <app-toggle-group
                  idPrefix="initial-og-mode"
                  label="Initial pitch OG strategy"
                  [options]="initialOgModeOptions"
                  [value]="facade.initialOgMode()"
                  (valueChange)="facade.setInitialOgMode($event)"
                />

                @if (facade.initialOgMode() === 'manual') {
                  <app-ui-field
                    fieldId="manual-initial-og"
                    label="Manual initial pitch OG"
                    [value]="facade.manualInitialOg()"
                    unit="SG"
                    min="1.001"
                    max="1.300"
                    step="0.001"
                    helper="Controls only the gravity at pitch; total fermentable load still comes from target ABV."
                    [error]="facade.fieldErrors().manualInitialOg"
                    (valueChange)="facade.setManualInitialOg($event)"
                  />
                }

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
                }
              </div>
            </details>
          </section>
        </div>

        <div class="results-column">
          <section class="worksheet-section" aria-labelledby="initial-must-heading">
            <header class="section-heading">
              <p>Step 2</p>
              <h2 id="initial-must-heading">Initial Must</h2>
              <span>Honey to mix now and reserve for later.</span>
            </header>

            <div class="inline-notices" aria-label="Initial must gravity notices">
              <app-notices [notices]="facade.initialMustViewModel().notices" />
            </div>

            <app-result-rows [rows]="facade.initialMustViewModel().rows" />
          </section>

          <section class="step-feeds worksheet-section" aria-labelledby="step-feeds-heading">
            <header class="section-heading">
              <p>Step 3</p>
              <h2 id="step-feeds-heading">Step Feeds</h2>
              <span>Measured gravity sets the timing; approximate days are reminders.</span>
            </header>

            <div class="inline-notices" aria-label="Step feed notices">
              <app-notices [notices]="facade.stepFeedsViewModel().notices" />
            </div>

            <p class="step-feed-summary">{{ facade.stepFeedsViewModel().summary }}</p>

            @if (facade.stepFeedsViewModel().hasFeeds) {
              <ol class="step-feed-list">
                @for (feed of facade.stepFeedsViewModel().feeds; track feed.feedNumber) {
                  <li class="step-feed-card">
                    <div>
                      <span>Feed {{ feed.feedNumber }}</span>
                      <strong>{{ feed.honeyAmount }}</strong>
                    </div>
                    <p class="gravity-trigger">At SG {{ feed.gravityMilestone }}</p>
                    <p>{{ feed.timingGuidance }}</p>
                  </li>
                }
              </ol>
            }
          </section>

          @if (facade.summaryNotices().length) {
            <section class="notice-summary worksheet-section" aria-label="Active worksheet summary">
              <h2>Active worksheet notices</h2>
              <app-notices [notices]="facade.summaryNotices()" />
            </section>
          }

          <section class="plan-output worksheet-section" aria-label="Generated planner output">
            <h2>Brew plan</h2>
            <pre id="planner-output">{{ facade.plannerOutput() }}</pre>
          </section>
        </div>
      </div>
    </app-ui-section>
  `,
  styles: `
    .worksheet {
      display: grid;
      gap: 1rem;
    }

    .input-column,
    .results-column {
      min-width: 0;
    }

    .results-column {
      display: grid;
      align-content: start;
      gap: 1rem;
    }

    .worksheet-section {
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 0.625rem;
      background: var(--surface-strong);
    }

    .section-heading {
      margin-bottom: 1rem;
    }

    .section-heading p,
    .section-heading h2,
    .section-heading span,
    .notice-summary h2,
    .plan-output h2 {
      margin: 0;
    }

    .section-heading p {
      color: var(--accent);
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .section-heading h2,
    .notice-summary h2,
    .plan-output h2 {
      font-size: 1.25rem;
    }

    .section-heading span {
      display: block;
      margin-top: 0.25rem;
      color: var(--muted);
      line-height: 1.4;
    }

    .controls,
    .advanced-content {
      display: grid;
      gap: 0.75rem;
    }

    .controls {
      margin-bottom: 1rem;
    }

    .advanced {
      padding: 0.875rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    .advanced summary {
      cursor: pointer;
      font-weight: 800;
    }

    .advanced-content {
      margin-top: 0.875rem;
    }

    .custom-yeast {
      margin: 0;
      padding-top: 0.875rem;
      border-top: 1px solid var(--border);
    }

    .notice-summary h2,
    .plan-output h2 {
      margin-bottom: 0.75rem;
    }

    .step-feed-summary {
      margin: 0;
      color: var(--muted);
      line-height: 1.5;
    }

    .step-feed-list {
      display: grid;
      gap: 0.75rem;
      margin: 1rem 0 0;
      padding: 0;
      list-style: none;
    }

    .step-feed-card {
      padding: 0.875rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    .step-feed-card div {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
    }

    .step-feed-card span {
      color: var(--muted);
      font-size: 0.75rem;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .step-feed-card strong {
      font-size: 1.125rem;
    }

    .step-feed-card p {
      margin: 0.5rem 0 0;
      color: var(--muted);
      line-height: 1.4;
    }

    .step-feed-card .gravity-trigger {
      color: var(--text);
      font-size: 1.125rem;
      font-weight: 800;
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

    @media (min-width: 58rem) {
      .worksheet {
        grid-template-columns: minmax(20rem, 0.8fr) minmax(0, 1.2fr);
        align-items: start;
      }

      .input-column {
        position: sticky;
        top: 1rem;
      }

      .step-feed-list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
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
  protected readonly initialOgModeOptions: ToggleOption<InitialOgMode>[] = [
    { label: 'Automatic', value: 'automatic' },
    { label: 'Manual', value: 'manual' },
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
