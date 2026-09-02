import { Component, input, output } from '@angular/core';
import type { SelectOption } from './ui.models';

@Component({
  selector: 'app-select-field',
  standalone: true,
  template: `
    <label class="field" [class.invalid]="error()" [attr.for]="fieldId()">
      <span class="label">{{ label() }}</span>
      <select
        [id]="fieldId()"
        [value]="value()"
        [attr.aria-invalid]="error() ? 'true' : 'false'"
        (change)="onChange($event)"
      >
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      @if (helper()) {
        <span class="helper">{{ helper() }}</span>
      }
      @if (error()) {
        <span class="error">{{ error() }}</span>
      }
    </label>
  `,
  styles: `
    .field {
      display: grid;
      grid-template-columns: 1fr minmax(10rem, 16rem);
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
      font-weight: 700;
    }

    .invalid {
      border-color: var(--danger);
    }

    select {
      width: 100%;
      min-height: 2.5rem;
      border: 1px solid var(--border);
      border-radius: 0.375rem;
      padding: 0.5rem 0.625rem;
      background: var(--surface-strong);
      color: inherit;
      font: inherit;
    }

    .helper,
    .error {
      grid-column: 1 / -1;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1.35;
    }

    .helper {
      color: var(--muted);
    }

    .error {
      color: var(--danger);
    }

    @media (max-width: 36rem) {
      .field {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class SelectFieldComponent<T extends string = string> {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<T>();
  readonly options = input.required<SelectOption<T>[]>();
  readonly helper = input('');
  readonly error = input<string | undefined>();
  readonly valueChange = output<T>();

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value as T);
  }
}
