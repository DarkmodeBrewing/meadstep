import { Component, inject } from '@angular/core';
import {
  PreferencesService,
  type ThemePreference,
} from '../shared/preferences/preferences.service';
import { ToggleGroupComponent } from '../shared/ui/toggle-group.component';
import type { ToggleOption } from '../shared/ui/ui.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToggleGroupComponent],
  template: `
    <header>
      <div>
        <p>MeadStep</p>
        <span>Mead maker toolbox</span>
      </div>
      <app-toggle-group
        idPrefix="theme"
        label="Theme"
        [options]="themeOptions"
        [value]="preferences.themePreference()"
        (valueChange)="preferences.setThemePreference($event)"
      />
    </header>
  `,
  styles: `
    header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    p,
    span {
      display: block;
      margin: 0;
    }

    p {
      font-size: 1.25rem;
      font-weight: 900;
    }

    span {
      color: var(--muted);
      font-weight: 700;
    }

    app-toggle-group {
      max-width: 22rem;
    }

    @media (max-width: 42rem) {
      header {
        display: block;
      }
    }
  `,
})
export class AppHeaderComponent {
  protected readonly preferences = inject(PreferencesService);
  protected readonly themeOptions: ToggleOption<ThemePreference>[] = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];
}
