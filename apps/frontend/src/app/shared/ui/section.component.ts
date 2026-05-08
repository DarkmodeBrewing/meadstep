import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-section',
  standalone: true,
  template: `
    <section class="section" [attr.aria-label]="title()">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1>{{ title() }}</h1>
      @if (description()) {
        <p class="description">{{ description() }}</p>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .section {
      width: min(100%, 48rem);
      margin: 0 auto;
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: var(--muted);
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    h1 {
      margin: 0 0 1rem;
      font-size: 2.75rem;
      line-height: 1;
    }

    .description {
      max-width: 42rem;
      margin: 0 0 1rem;
      color: var(--muted);
      line-height: 1.5;
    }
  `,
})
export class UiSectionComponent {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
