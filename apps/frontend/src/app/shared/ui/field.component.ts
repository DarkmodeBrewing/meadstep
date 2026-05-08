import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-field',
  standalone: true,
  template: `
    <label class="field" [class.invalid]="error()" [attr.for]="fieldId()">
      <span class="label">{{ label() }}</span>
      <input
        [id]="fieldId()"
        type="number"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [attr.aria-invalid]="error() ? 'true' : 'false'"
        (input)="onInput($event)"
      />
      <span class="unit">{{ unit() }}</span>
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
      grid-template-columns: 1fr minmax(7rem, 10rem) minmax(2.5rem, auto);
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

    input {
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
export class UiFieldComponent {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly unit = input('');
  readonly min = input<number | string | null>(null);
  readonly max = input<number | string | null>(null);
  readonly step = input<number | string>('any');
  readonly helper = input('');
  readonly error = input<string | undefined>();
  readonly valueChange = output<number>();

  onInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.valueChange.emit(value);
  }
}
