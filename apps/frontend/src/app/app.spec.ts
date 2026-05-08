import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { GravityToolFacade } from './features/tools/gravity/gravity-tool.facade';
import { HoneyOgToolFacade } from './features/tools/honey-og/honey-og-tool.facade';
import { PreferencesService } from './shared/preferences/preferences.service';

describe('App routing workflows', () => {
  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), provideLocationMocks()],
    }).compileComponents();
  });

  it('redirects the root route to the planner screen', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/planner');
    expect(compiled.textContent).toContain('Honey-only planner');
    expect(compiled.textContent).toContain('Honey needed');
  });

  it('renders the honey OG workflow with inline validation and assumptions', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/honey-og');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Honey OG');
    expect(compiled.textContent).toContain('35 PPG / 82% sugar');
    expect(compiled.textContent).toContain('Estimated OG');
    expect(compiled.textContent).toContain('1.058');

    const honeyInput = compiled.querySelector<HTMLInputElement>('#honey-kg');
    expect(honeyInput).toBeTruthy();

    honeyInput!.value = '0';
    honeyInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Enter more than 0 kg honey.');
    expect(honeyInput!.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.textContent).toContain('Measure actual OG after mixing');
  });

  it('renders the gravity conversion workflow in both directions', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/gravity');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gravity');
    expect(compiled.textContent).toContain('21.6 Brix');

    const modeControl = compiled.querySelector<HTMLInputElement>('#mode-brix-to-sg');
    expect(modeControl).toBeTruthy();

    modeControl!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const brixInput = compiled.querySelector<HTMLInputElement>('#brix-value');
    expect(brixInput).toBeTruthy();
    brixInput!.value = '24';
    brixInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('1.101 SG');
  });
});

describe('PreferencesService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('persists unit and theme preferences globally', () => {
    const service = TestBed.inject(PreferencesService);

    service.setUnitSystem('us');
    service.setThemePreference('dark');

    expect(service.unitSystem()).toBe('us');
    expect(service.themePreference()).toBe('dark');
    expect(localStorage.getItem('meadstep.preferences')).toContain('"unitSystem":"us"');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });
});

describe('tool facades', () => {
  it('maps honey OG inputs to result rows and validation state', () => {
    const facade = TestBed.inject(HoneyOgToolFacade);

    expect(facade.resultRows().map((row) => row.value)).toContain('1.058');

    facade.setHoneyKg(0);

    expect(facade.fieldErrors().honeyKg).toBe('Enter more than 0 kg honey.');
    expect(facade.resultRows()).toEqual([]);
  });

  it('maps gravity conversion modes to readable result rows', () => {
    const facade = TestBed.inject(GravityToolFacade);

    expect(facade.resultRows()[0]?.value).toBe('21.6 Brix');

    facade.setMode('brix-to-sg');
    facade.setBrix(24);

    expect(facade.resultRows()[0]?.value).toBe('1.101 SG');
  });
});
