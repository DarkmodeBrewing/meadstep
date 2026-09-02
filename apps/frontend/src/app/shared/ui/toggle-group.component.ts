import { Component, input, output } from '@angular/core';
import type { ToggleOption } from './ui.models';

@Component({
  selector: 'app-toggle-group',
  standalone: true,
  template: `
    <fieldset class="toggle" [attr.aria-label]="label()">
      <legend>{{ label() }}</legend>
      @for (option of options(); track option.value) {
        <label [attr.for]="idPrefix() + '-' + option.value">
          <input
            [id]="idPrefix() + '-' + option.value"
            type="radio"
            [name]="idPrefix()"
            [value]="option.value"
            [checked]="value() === option.value"
            (change)="valueChange.emit(option.value)"
          />
          <span>{{ option.label }}</span>
        </label>
      }
    </fieldset>
  `,
  styles: `
    .toggle {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 0 0 1rem;
      padding: 0;
      border: 0;
    }

    legend {
      width: 100%;
      margin-bottom: 0.25rem;
      color: var(--muted);
      font-size: 0.875rem;
      font-weight: 700;
    }

    label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 2.75rem;
      padding: 0.625rem 0.875rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      font-weight: 700;
    }
  `,
})
export class ToggleGroupComponent<T extends string = string> {
  readonly idPrefix = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<T>();
  readonly options = input.required<ToggleOption<T>[]>();
  readonly valueChange = output<T>();
}
