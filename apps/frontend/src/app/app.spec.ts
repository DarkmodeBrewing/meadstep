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

    const volumeInput = compiled.querySelector<HTMLInputElement>('#batch-volume-liters');
    expect(volumeInput).toBeTruthy();

    volumeInput!.value = '10';
    volumeInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('3.15 kg');
  });
});
