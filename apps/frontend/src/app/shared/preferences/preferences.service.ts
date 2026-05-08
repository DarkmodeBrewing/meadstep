import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import type { UnitSystem } from '@meadstep/core';

export type ThemePreference = 'system' | 'light' | 'dark';

interface StoredPreferences {
  unitSystem: UnitSystem;
  themePreference: ThemePreference;
}

const STORAGE_KEY = 'meadstep.preferences';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;
  private readonly initial = this.readPreferences();

  readonly unitSystem = signal<UnitSystem>(this.initial.unitSystem);
  readonly themePreference = signal<ThemePreference>(this.initial.themePreference);

  constructor() {
    effect(() => {
      const preferences = {
        unitSystem: this.unitSystem(),
        themePreference: this.themePreference(),
      };

      this.storage?.setItem(STORAGE_KEY, JSON.stringify(preferences));
      this.applyTheme(preferences.themePreference);
    });
  }

  setUnitSystem(unitSystem: UnitSystem): void {
    this.unitSystem.set(unitSystem);
    this.persist();
  }

  setThemePreference(themePreference: ThemePreference): void {
    this.themePreference.set(themePreference);
    this.persist();
    this.applyTheme(themePreference);
  }

  private readPreferences(): StoredPreferences {
    const raw = this.storage?.getItem(STORAGE_KEY);

    if (!raw) {
      return { unitSystem: 'metric', themePreference: 'system' };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<StoredPreferences>;

      return {
        unitSystem: parsed.unitSystem === 'us' ? 'us' : 'metric',
        themePreference: isThemePreference(parsed.themePreference)
          ? parsed.themePreference
          : 'system',
      };
    } catch {
      return { unitSystem: 'metric', themePreference: 'system' };
    }
  }

  private applyTheme(themePreference: ThemePreference): void {
    const root = this.document.documentElement;
    const resolved = themePreference === 'system' ? this.resolveSystemTheme() : themePreference;

    root.dataset['theme'] = resolved;
  }

  private resolveSystemTheme(): 'light' | 'dark' {
    return this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private persist(): void {
    this.storage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        unitSystem: this.unitSystem(),
        themePreference: this.themePreference(),
      }),
    );
  }
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark';
}
