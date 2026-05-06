import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renders and recalculates the shared honey-only planner result', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Honey needed');
    expect(compiled.textContent).toContain('1.58 kg');
    expect(compiled.textContent).toContain('Estimated OG');
    expect(compiled.textContent).toContain('1.091');

    const volumeInput = compiled.querySelector<HTMLInputElement>('#batch-volume');
    expect(volumeInput).toBeTruthy();

    volumeInput!.value = '10';
    volumeInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('3.15 kg');
  });

  it('switches planner inputs and outputs between metric and US units', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1.58 kg');

    const usUnitControl = compiled.querySelector<HTMLInputElement>('#unit-system-us');
    expect(usUnitControl).toBeTruthy();

    usUnitControl!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('gal');
    expect(compiled.textContent).toContain('3.48 lb');

    const volumeInput = compiled.querySelector<HTMLInputElement>('#batch-volume');
    expect(volumeInput).toBeTruthy();
    expect(volumeInput!.valueAsNumber).toBeCloseTo(1.32, 2);

    volumeInput!.value = '2.64';
    volumeInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('6.95 lb');
  });

  it('generates planner output in the selected unit system', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const usUnitControl = compiled.querySelector<HTMLInputElement>('#unit-system-us');

    usUnitControl!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const planOutput = compiled.querySelector<HTMLElement>('#planner-output');
    expect(planOutput).toBeTruthy();
    expect(planOutput!.textContent).toContain('Batch volume: 1.32 gal');
    expect(planOutput!.textContent).toContain('Honey needed: 3.48 lb');
    expect(planOutput!.textContent).toContain('Estimated OG: 1.091');
    expect(planOutput!.textContent).not.toContain('kg');
  });
});
