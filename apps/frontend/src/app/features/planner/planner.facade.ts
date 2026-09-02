import { computed, inject, Injectable, signal } from '@angular/core';
import {
  BUILT_IN_YEASTS,
  createCustomYeast,
  customYeastInputSchema,
  CUSTOM_YEAST_ID,
  DEFAULT_BUILT_IN_YEAST_ID,
  evaluateYeastTolerance,
  getBuiltInYeast,
  MAX_CALCULATOR_ABV_PERCENT,
  planHoneyOnlyBatchForUnitSystem,
  yeastSelectionIdSchema,
  convertVolume,
  type NitrogenRequirement,
  type UnitSystem,
  type YeastProfile,
  type YeastSelectionId,
} from '@meadstep/core';
import type { Notice } from '../../shared/notices/notice.model';
import { NoticeService } from '../../shared/notices/notice.service';
import { PreferencesService } from '../../shared/preferences/preferences.service';
import type { ResultRow, SelectOption } from '../../shared/ui/ui.models';

export interface CustomYeastFieldErrors {
  name?: string;
  alcoholTolerancePercent?: string;
}

const YEAST_NOTICE_SCOPE = 'planner:yeast-tolerance';

@Injectable({ providedIn: 'root' })
export class PlannerFacade {
  private readonly preferences = inject(PreferencesService);
  private readonly noticeService = inject(NoticeService);

  readonly batchVolume = signal(5);
  readonly targetAbvPercent = signal(12);
  readonly unitSystem = this.preferences.unitSystem;
  readonly selectedYeastId = signal<YeastSelectionId>(DEFAULT_BUILT_IN_YEAST_ID);
  readonly customYeastName = signal('');
  readonly customYeastTolerancePercent = signal(14);
  readonly customYeastNitrogenRequirement = signal<NitrogenRequirement>('medium');

  readonly yeastOptions: SelectOption<YeastSelectionId>[] = [
    ...BUILT_IN_YEASTS.map((yeast) => ({
      label: `${yeast.brand} ${yeast.name}`,
      value: yeast.id,
    })),
    { label: 'Custom yeast…', value: CUSTOM_YEAST_ID },
  ];

  readonly customYeastFieldErrors = computed<CustomYeastFieldErrors>(() => {
    const errors: CustomYeastFieldErrors = {};

    if (this.selectedYeastId() !== CUSTOM_YEAST_ID) {
      return errors;
    }

    const parsed = customYeastInputSchema.safeParse({
      name: this.customYeastName(),
      alcoholTolerancePercent: this.customYeastTolerancePercent(),
      nitrogenRequirement: this.customYeastNitrogenRequirement(),
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === 'name') {
          errors.name = issue.message;
        }

        if (issue.path[0] === 'alcoholTolerancePercent') {
          errors.alcoholTolerancePercent = issue.message;
        }
      }
    }

    return errors;
  });

  readonly selectedYeast = computed<YeastProfile | undefined>(() => {
    const selectedYeastId = this.selectedYeastId();

    if (selectedYeastId !== CUSTOM_YEAST_ID) {
      return getBuiltInYeast(selectedYeastId);
    }

    const parsed = customYeastInputSchema.safeParse({
      name: this.customYeastName(),
      alcoholTolerancePercent: this.customYeastTolerancePercent(),
      nitrogenRequirement: this.customYeastNitrogenRequirement(),
    });

    return parsed.success ? createCustomYeast(parsed.data) : undefined;
  });

  readonly result = computed(() =>
    planHoneyOnlyBatchForUnitSystem({
      unitSystem: this.unitSystem(),
      batchVolume: this.batchVolume(),
      targetAbvPercent: this.targetAbvPercent(),
    }),
  );

  readonly toleranceResult = computed(() => {
    const yeast = this.selectedYeast();

    if (!yeast) {
      return undefined;
    }

    return evaluateYeastTolerance({
      yeast,
      targetAbvPercent: this.targetAbvPercent(),
      totalEquivalentOg: this.result().canonical.estimatedOriginalGravity,
    });
  });

  readonly yeastNotices = computed<Notice[]>(() => {
    const tolerance = this.toleranceResult();

    if (!tolerance) {
      return [];
    }

    return [
      {
        id: 'yeast-tolerance',
        tone: tolerance.noticeTone,
        title: tolerance.title,
        message: tolerance.message,
        action: tolerance.action,
        source: YEAST_NOTICE_SCOPE,
        placement: 'both',
      },
    ];
  });

  readonly summaryNotices = this.noticeService.all;

  readonly volumeUnit = computed(() =>
    this.result().display.batchVolumeUnit === 'gallons' ? 'gal' : 'L',
  );

  readonly selectedYeastHelper = computed(() => {
    const yeast = this.selectedYeast();

    if (!yeast) {
      return 'Open Advanced and enter valid custom yeast details.';
    }

    return `${yeast.alcoholTolerancePercent.toFixed(1)}% tolerance · ${yeast.nitrogenRequirement} nitrogen requirement`;
  });

  readonly resultRows = computed<ResultRow[]>(() => {
    const display = this.result().display;
    const honeyUnit = display.honeyWeightUnit === 'pounds' ? 'lb' : 'kg';
    const yeast = this.selectedYeast();

    return [
      {
        label: 'Honey needed',
        value: `${display.honeyWeight.toFixed(2)} ${honeyUnit}`,
      },
      {
        label: 'Estimated OG',
        value: display.estimatedOriginalGravity.toFixed(3),
      },
      {
        label: 'Estimated FG',
        value: display.estimatedFinalGravity.toFixed(3),
      },
      {
        label: 'Estimated ABV',
        value: `${display.estimatedAbvPercent.toFixed(1)}%`,
      },
      yeast
        ? {
            label: 'Selected yeast',
            value: yeast.name,
            helper: `${yeast.alcoholTolerancePercent.toFixed(1)}% tolerance · ${yeast.nitrogenRequirement} nitrogen requirement`,
          }
        : {
            label: 'Selected yeast',
            value: 'Enter valid values',
            helper: 'Complete the custom yeast fields in Advanced.',
          },
    ];
  });

  readonly plannerOutput = computed(() => {
    const result = this.result();
    const honeyNeeded = this.resultRows()[0]?.value ?? '';
    const yeast = this.selectedYeast();
    const tolerance = this.toleranceResult();

    return [
      '# MeadStep honey-only plan',
      `Batch volume: ${result.display.batchVolume.toFixed(2)} ${this.volumeUnit()}`,
      `Honey needed: ${honeyNeeded}`,
      `Estimated OG: ${result.display.estimatedOriginalGravity.toFixed(3)}`,
      `Estimated FG: ${result.display.estimatedFinalGravity.toFixed(3)}`,
      `Estimated ABV: ${result.display.estimatedAbvPercent.toFixed(1)}%`,
      yeast
        ? `Yeast: ${yeast.brand} ${yeast.name} (${yeast.alcoholTolerancePercent.toFixed(1)}% tolerance, ${yeast.nitrogenRequirement} nitrogen requirement)`
        : 'Yeast: Enter valid custom yeast values.',
      tolerance ? `Yeast tolerance: ${tolerance.level}` : '',
      tolerance?.estimatedToleranceLimitedFinalGravity !== null &&
      tolerance?.estimatedToleranceLimitedFinalGravity !== undefined
        ? `Tolerance-limited FG hint: ${tolerance.estimatedToleranceLimitedFinalGravity.toFixed(3)}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
  });

  constructor() {
    this.syncYeastNotices();
  }

  setBatchVolume(value: number): void {
    if (Number.isFinite(value) && value > 0) {
      this.batchVolume.set(value);
      this.syncYeastNotices();
    }
  }

  setTargetAbvPercent(value: number): void {
    if (Number.isFinite(value) && value > 0 && value <= 20) {
      this.targetAbvPercent.set(value);
      this.syncYeastNotices();
    }
  }

  setUnitSystem(unitSystem: UnitSystem): void {
    const currentUnitSystem = this.unitSystem();

    if (currentUnitSystem !== unitSystem) {
      const current = this.batchVolume();
      const nextBatchVolume =
        unitSystem === 'us'
          ? convertVolume(current, 'liters', 'gallons')
          : convertVolume(current, 'gallons', 'liters');

      this.batchVolume.set(nextBatchVolume);
      this.preferences.setUnitSystem(unitSystem);
    }
  }

  setSelectedYeastId(value: YeastSelectionId): void {
    this.selectedYeastId.set(yeastSelectionIdSchema.parse(value));
    this.syncYeastNotices();
  }

  setCustomYeastName(value: string): void {
    this.customYeastName.set(value);
    this.syncYeastNotices();
  }

  setCustomYeastTolerancePercent(value: number): void {
    this.customYeastTolerancePercent.set(value);
    this.syncYeastNotices();
  }

  setCustomYeastNitrogenRequirement(value: NitrogenRequirement): void {
    this.customYeastNitrogenRequirement.set(value);
    this.syncYeastNotices();
  }

  private syncYeastNotices(): void {
    this.noticeService.set(YEAST_NOTICE_SCOPE, this.yeastNotices());
  }
}
