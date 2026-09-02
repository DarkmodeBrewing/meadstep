import { Component, input } from '@angular/core';
import type { Notice, NoticeTone } from '../notices/notice.model';

@Component({
  selector: 'app-notices',
  standalone: true,
  template: `
    @if (notices().length) {
      <div class="notices">
        @for (notice of notices(); track notice.id ?? notice.title) {
          <article [class]="notice.tone" [attr.data-tone]="notice.tone">
            <div class="heading">
              <span class="icon" aria-hidden="true">{{ iconFor(notice.tone) }}</span>
              <strong>{{ notice.title }}</strong>
            </div>
            <p>{{ notice.message }}</p>
            @if (notice.action) {
              <p class="action">{{ notice.action }}</p>
            }
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
      padding: 0.75rem 0.875rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      background: var(--surface);
    }

    .info {
      border-color: var(--info);
    }

    .ok {
      border-color: var(--ok);
    }

    .warning {
      border-color: var(--warning);
    }

    .error {
      border-color: var(--danger);
    }

    .heading {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .icon {
      display: inline-grid;
      width: 1.25rem;
      height: 1.25rem;
      place-items: center;
      border: 1px solid currentColor;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 900;
      line-height: 1;
    }

    .info .icon {
      color: var(--info);
    }

    .ok .icon {
      color: var(--ok);
    }

    .warning .icon {
      color: var(--warning);
    }

    .error .icon {
      color: var(--danger);
    }

    strong,
    p {
      margin: 0;
    }

    p {
      margin-top: 0.25rem;
      color: var(--muted);
      line-height: 1.4;
    }

    .action {
      font-weight: 700;
    }
  `,
})
export class NoticesComponent {
  readonly notices = input.required<Notice[]>();

  protected iconFor(tone: NoticeTone): string {
    return {
      info: 'i',
      ok: '✓',
      warning: '!',
      error: '×',
    }[tone];
  }
}
