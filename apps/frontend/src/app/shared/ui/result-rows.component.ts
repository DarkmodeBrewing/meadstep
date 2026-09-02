import { Component, input } from '@angular/core';
import type { ResultRow } from './ui.models';

@Component({
  selector: 'app-result-rows',
  standalone: true,
  template: `
    <dl class="result">
      @for (row of rows(); track row.label) {
        <div>
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
          @if (row.helper) {
            <p>{{ row.helper }}</p>
          }
        </div>
      }
    </dl>
  `,
  styles: `
    .result {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
      margin: 0 0 1rem;
    }

    .result div {
      min-height: 6rem;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    dt {
      margin-bottom: 0.5rem;
      color: var(--muted);
      font-size: 0.875rem;
      font-weight: 700;
    }

    dd {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 800;
    }

    p {
      margin: 0.5rem 0 0;
      color: var(--muted);
      font-size: 0.875rem;
      line-height: 1.4;
    }

    @media (max-width: 36rem) {
      .result {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ResultRowsComponent {
  readonly rows = input.required<ResultRow[]>();
}
