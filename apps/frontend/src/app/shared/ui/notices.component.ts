import { Component, input } from '@angular/core';
import type { Notice } from '../notices/notice.model';

@Component({
  selector: 'app-notices',
  standalone: true,
  template: `
    @if (notices().length) {
      <div class="notices">
        @for (notice of notices(); track notice.title) {
          <article [class]="notice.tone">
            <strong>{{ notice.title }}</strong>
            <p>{{ notice.message }}</p>
          </article>
        }
      </div>
    }
  `,
  styles: `
    .notices {
      display: grid;
      gap: 0.75rem;
      margin: 0 0 1rem;
    }

    article {
      padding: 0.875rem 1rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    .warning {
      border-color: var(--accent);
    }

    .error {
      border-color: var(--danger);
    }

    strong,
    p {
      display: block;
      margin: 0;
    }

    p {
      margin-top: 0.25rem;
      color: var(--muted);
      line-height: 1.4;
    }
  `,
})
export class NoticesComponent {
  readonly notices = input.required<Notice[]>();
}
