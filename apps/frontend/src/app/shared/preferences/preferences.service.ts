import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import type { UnitSystem } from '@meadstep/core';

export type ThemePreference = 'system' | 'light' | 'dark';

interface StoredPreferences {
  unitSystem: UnitSystem;
  themePreference: ThemePreference;
}

const STORAGE_KEY = 'meadstep.preferences';
const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storage = this.document.defaultView?.localStorage;
  private readonly systemThemeQuery =
    this.document.defaultView?.matchMedia?.(SYSTEM_THEME_QUERY);
  private readonly initial = this.readPreferences();
  private readonly handleSystemThemeChange = (): void => {
    this.applyTheme('system');
  };

  readonly unitSystem = signal<UnitSystem>(this.initial.unitSystem);
  readonly themePreference = signal<ThemePreference>(this.initial.themePreference);

  constructor() {
    this.persist();
    this.applyTheme(this.themePreference());
    this.syncSystemThemeListener();

    this.destroyRef.onDestroy(() => {
      this.systemThemeQuery?.removeEventListener(
        'change',
        this.handleSystemThemeChange,
      );
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
    this.syncSystemThemeListener();
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
    const resolved =
      themePreference === 'system' ? this.resolveSystemTheme() : themePreference;

    root.dataset['theme'] = resolved;
  }

  private resolveSystemTheme(): 'light' | 'dark' {
    return this.systemThemeQuery?.matches ? 'dark' : 'light';
  }

  private syncSystemThemeListener(): void {
    this.systemThemeQuery?.removeEventListener(
      'change',
      this.handleSystemThemeChange,
    );

    if (this.themePreference() === 'system') {
      this.systemThemeQuery?.addEventListener(
        'change',
        this.handleSystemThemeChange,
      );
    }
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
