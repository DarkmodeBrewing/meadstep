import { provideLocationMocks } from '@angular/common/testing';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { PlannerFacade } from './features/planner/planner.facade';
import { AbvToolFacade } from './features/tools/abv/abv-tool.facade';
import { GravityToolFacade } from './features/tools/gravity/gravity-tool.facade';
import { HoneyOgToolFacade } from './features/tools/honey-og/honey-og-tool.facade';
import { NoticeService } from './shared/notices/notice.service';
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
    expect(compiled.textContent).toContain('Initial Must');
    expect(compiled.textContent).toContain('Total honey needed');
    expect(compiled.textContent).toContain('EC-1118');
    expect(compiled.textContent).toContain('Comfortable yeast tolerance margin');
  });

  it('renders automatic and manual initial must planning with validation', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/planner');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const targetAbvInput = compiled.querySelector<HTMLInputElement>('#target-abv-percent');
    expect(compiled.textContent).toContain('1.091');
    expect(compiled.textContent).toContain('0.00 kg');

    targetAbvInput!.value = '18';
    targetAbvInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Automatic pitch gravity, capped at 1.110.');
    expect(compiled.textContent).toContain('0.47 kg');
    expect(compiled.textContent).toContain('Elevated initial gravity');
    expect(compiled.textContent).toContain('Strong-mead fermentable load');

    const manualModeControl = compiled.querySelector<HTMLInputElement>('#initial-og-mode-manual');
    manualModeControl!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const manualInitialOgInput = compiled.querySelector<HTMLInputElement>('#manual-initial-og');
    expect(manualInitialOgInput).toBeTruthy();

    manualInitialOgInput!.value = '1.095';
    manualInitialOgInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Manual initial pitch gravity.');
    expect(compiled.textContent).toContain('0.73 kg');

    manualInitialOgInput!.value = '1.2';
    manualInitialOgInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(manualInitialOgInput!.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.textContent).toContain(
      'Initial pitch OG cannot exceed the total equivalent OG of 1.137.',
    );
    expect(compiled.textContent).toContain('Enter valid values');
  });

  it('renders curated and custom yeast tolerance workflows', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/planner');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const yeastSelect = compiled.querySelector<HTMLSelectElement>('#yeast-selection');
    const targetAbvInput = compiled.querySelector<HTMLInputElement>('#target-abv-percent');
    expect(yeastSelect).toBeTruthy();
    expect(targetAbvInput).toBeTruthy();

    yeastSelect!.value = 'd47';
    yeastSelect!.dispatchEvent(new Event('change'));
    targetAbvInput!.value = '15';
    targetAbvInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Target exceeds yeast tolerance');
    expect(compiled.textContent).toContain('FG may finish around 1.008');
    expect(compiled.querySelector('.inline-notices article.error')).toBeTruthy();
    expect(compiled.textContent).toContain('Active worksheet notices');

    yeastSelect!.value = 'custom';
    yeastSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    const advanced = compiled.querySelector<HTMLDetailsElement>('details.advanced');
    const customNameInput = compiled.querySelector<HTMLInputElement>('#custom-yeast-name');
    expect(advanced?.open).toBe(true);
    expect(customNameInput?.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.textContent).toContain('Enter a yeast name.');

    customNameInput!.value = 'House Kveik';
    customNameInput!.dispatchEvent(new Event('input'));
    const customToleranceInput =
      compiled.querySelector<HTMLInputElement>('#custom-yeast-tolerance');
    customToleranceInput!.value = '13';
    customToleranceInput!.dispatchEvent(new Event('input'));
    const nitrogenSelect = compiled.querySelector<HTMLSelectElement>('#custom-yeast-nitrogen');
    nitrogenSelect!.value = 'high';
    nitrogenSelect!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('House Kveik');
    expect(compiled.textContent).toContain('13.0% tolerance · high nitrogen requirement');
    expect(compiled.textContent).toContain('Target exceeds yeast tolerance');
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

  it('renders classic and reverse ABV workflows with neutral invalid output', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(App);

    await router.navigateByUrl('/abv');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('ABV calculator');
    expect(compiled.textContent).toContain('Estimated ABV');
    expect(compiled.textContent).toContain('10.5%');

    const finalGravityInput = compiled.querySelector<HTMLInputElement>('#abv-fg');
    expect(finalGravityInput).toBeTruthy();
    finalGravityInput!.value = '1.1';
    finalGravityInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(finalGravityInput!.getAttribute('aria-invalid')).toBe('true');
    expect(compiled.textContent).toContain('Final gravity must not exceed original gravity.');
    expect(compiled.textContent).toContain('Enter valid values to see the result.');

    const reverseModeControl = compiled.querySelector<HTMLInputElement>('#abv-mode-reverse');
    expect(reverseModeControl).toBeTruthy();
    reverseModeControl!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Estimated FG');
    expect(compiled.textContent).toContain('1.010');
  });
});

describe('PreferencesService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('follows OS theme changes while the system preference is selected', () => {
    let matchesDarkTheme = false;
    const changeListeners = new Set<() => void>();
    const systemThemeQuery = {
      get matches() {
        return matchesDarkTheme;
      },
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn((eventName: string, listener: () => void) => {
        if (eventName === 'change') {
          changeListeners.add(listener);
        }
      }),
      removeEventListener: vi.fn((eventName: string, listener: () => void) => {
        if (eventName === 'change') {
          changeListeners.delete(listener);
        }
      }),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => systemThemeQuery),
    );

    const service = TestBed.inject(PreferencesService);
    expect(document.documentElement.dataset['theme']).toBe('light');

    matchesDarkTheme = true;
    changeListeners.forEach((listener) => listener());
    expect(document.documentElement.dataset['theme']).toBe('dark');

    service.setThemePreference('light');
    expect(changeListeners.size).toBe(0);
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});

describe('tool facades', () => {
  it('maps yeast tolerance results into planner rows and the notice summary', () => {
    const facade = TestBed.inject(PlannerFacade);
    const noticeService = TestBed.inject(NoticeService);

    expect(facade.selectedYeast()?.name).toBe('EC-1118');
    expect(facade.yeastNotices()[0]?.tone).toBe('ok');

    facade.setTargetAbvPercent(18);
    expect(facade.toleranceResult()?.level).toBe('high');
    expect(facade.result()?.canonical.initialOriginalGravity).toBe(1.11);
    expect(facade.initialMustViewModel().rows[1]?.value).toBe('0.47 kg');

    facade.setSelectedYeastId('d47');
    expect(facade.toleranceResult()?.level).toBe('severe');
    expect(facade.toleranceResult()?.estimatedToleranceLimitedFinalGravity).toBeCloseTo(1.03, 3);
    expect(noticeService.all()).toEqual([...facade.yeastNotices(), ...facade.gravityNotices()]);

    facade.setSelectedYeastId('custom');
    expect(facade.customYeastFieldErrors().name).toBe('Enter a yeast name.');
    expect(facade.resultRows().at(-1)?.value).toBe('Enter valid values');

    facade.setCustomYeastName('House Kveik');
    facade.setCustomYeastTolerancePercent(13);
    facade.setCustomYeastNitrogenRequirement('high');
    expect(facade.selectedYeast()).toMatchObject({
      name: 'House Kveik',
      alcoholTolerancePercent: 13,
      nitrogenRequirement: 'high',
    });
  });

  it('maps manual initial OG validation and gravity warnings into the worksheet', () => {
    const facade = TestBed.inject(PlannerFacade);

    facade.setTargetAbvPercent(18);
    facade.setInitialOgMode('manual');
    facade.setManualInitialOg(1.095);

    expect(facade.result()?.canonical.initialOriginalGravity).toBe(1.095);
    expect(facade.initialMustViewModel().rows[1]?.value).toBe('0.73 kg');

    facade.setManualInitialOg(1.2);
    expect(facade.fieldErrors().manualInitialOg).toBe(
      'Initial pitch OG cannot exceed the total equivalent OG of 1.137.',
    );
    expect(facade.result()).toBeUndefined();
    expect(facade.initialMustViewModel().valid).toBe(false);
    expect(facade.initialMustViewModel().rows[0]?.value).toBe('Enter valid values');

    facade.setTargetAbvPercent(20);
    facade.setManualInitialOg(1.145);
    expect(facade.gravityNotices().map((notice) => notice.id)).toEqual([
      'initial_og_severe',
      'total_og_high',
    ]);
  });

  it('maps invalid setup fields to errors and neutral initial must output', () => {
    const facade = TestBed.inject(PlannerFacade);

    facade.setBatchVolume(0);
    expect(facade.fieldErrors().batchVolume).toBe('Enter a batch volume above 0.');
    expect(facade.initialMustViewModel().valid).toBe(false);

    facade.setBatchVolume(5);
    facade.setTargetAbvPercent(21);
    expect(facade.fieldErrors().targetAbvPercent).toBe('Enter target ABV up to 20%.');
    expect(facade.initialMustViewModel().rows).toEqual(
      expect.arrayContaining([expect.objectContaining({ value: 'Enter valid values' })]),
    );
  });

  it('maps ABV calculator modes to results and validation state', () => {
    const facade = TestBed.inject(AbvToolFacade);

    expect(facade.resultRows()[0]?.value).toBe('10.5%');

    facade.setMode('reverse');
    expect(facade.resultRows()[0]?.value).toBe('1.010');

    facade.setTargetAbvPercent(31);
    expect(facade.fieldErrors().targetAbvPercent).toBe('Enter target ABV from 0% to 30%.');
    expect(facade.resultRows()).toEqual([]);
  });

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
