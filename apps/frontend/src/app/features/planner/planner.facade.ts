import { computed, inject, Injectable, signal } from '@angular/core';
import {
  BUILT_IN_YEASTS,
  convertVolume,
  convertWeight,
  createCustomYeast,
  customYeastInputSchema,
  CUSTOM_YEAST_ID,
  DEFAULT_BUILT_IN_YEAST_ID,
  evaluateYeastTolerance,
  getBuiltInYeast,
  honeyOnlyPlannerUnitSystemInputSchema,
  initialOgModeSchema,
  planHoneyOnlyBatchForUnitSystem,
  yeastSelectionIdSchema,
  type HoneyOnlyPlannerUnitSystemResult,
  type InitialOgMode,
  type NitrogenRequirement,
  type UnitSystem,
  type YeastProfile,
  type YeastSelectionId,
} from '@meadstep/core';
import type { Notice } from '../../shared/notices/notice.model';
import { NoticeService } from '../../shared/notices/notice.service';
import { PreferencesService } from '../../shared/preferences/preferences.service';
import type { ResultRow, SelectOption } from '../../shared/ui/ui.models';

export interface PlannerFieldErrors {
  batchVolume?: string;
  targetAbvPercent?: string;
  manualInitialOg?: string;
}

export interface CustomYeastFieldErrors {
  name?: string;
  alcoholTolerancePercent?: string;
}

export interface PlannerSetupViewModel {
  batchVolume: number;
  volumeUnit: 'L' | 'gal';
  targetAbvPercent: number;
  unitSystem: UnitSystem;
  selectedYeastName: string;
  selectedYeastHelper: string;
}

export interface PlannerInitialMustViewModel {
  valid: boolean;
  rows: ResultRow[];
  notices: Notice[];
}

export interface PlannerStepFeedItemViewModel {
  feedNumber: number;
  honeyAmount: string;
  gravityMilestone: string;
  approximateDayLabel: string;
  timingGuidance: string;
}

export interface PlannerStepFeedsViewModel {
  valid: boolean;
  hasFeeds: boolean;
  summary: string;
  feeds: PlannerStepFeedItemViewModel[];
  notices: Notice[];
}

const YEAST_NOTICE_SCOPE = 'planner:yeast-tolerance';
const GRAVITY_NOTICE_SCOPE = 'planner:gravity';
const STEP_FEED_NOTICE_SCOPE = 'planner:step-feeds';

@Injectable({ providedIn: 'root' })
export class PlannerFacade {
  private readonly preferences = inject(PreferencesService);
  private readonly noticeService = inject(NoticeService);

  readonly batchVolume = signal(5);
  readonly targetAbvPercent = signal(12);
  readonly unitSystem = this.preferences.unitSystem;
  readonly initialOgMode = signal<InitialOgMode>('automatic');
  readonly manualInitialOg = signal(1.1);
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

  private readonly plannerInputValidation = computed(() =>
    honeyOnlyPlannerUnitSystemInputSchema.safeParse({
      unitSystem: this.unitSystem(),
      batchVolume: this.batchVolume(),
      targetAbvPercent: this.targetAbvPercent(),
      initialOgMode: this.initialOgMode(),
      manualInitialOg: this.initialOgMode() === 'manual' ? this.manualInitialOg() : undefined,
    }),
  );

  readonly fieldErrors = computed<PlannerFieldErrors>(() => {
    const validation = this.plannerInputValidation();

    if (validation.success) {
      return {};
    }

    const errors: PlannerFieldErrors = {};

    for (const issue of validation.error.issues) {
      const field = issue.path[0];

      if (field === 'batchVolume') {
        errors.batchVolume = issue.message;
      }

      if (field === 'targetAbvPercent') {
        errors.targetAbvPercent = issue.message;
      }

      if (field === 'manualInitialOg') {
        errors.manualInitialOg = issue.message;
      }
    }

    return errors;
  });

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

  readonly result = computed<HoneyOnlyPlannerUnitSystemResult | undefined>(() => {
    const validation = this.plannerInputValidation();

    return validation.success ? planHoneyOnlyBatchForUnitSystem(validation.data) : undefined;
  });

  readonly toleranceResult = computed(() => {
    const yeast = this.selectedYeast();
    const result = this.result();

    if (!yeast || !result) {
      return undefined;
    }

    return evaluateYeastTolerance({
      yeast,
      targetAbvPercent: result.canonical.targetAbvPercent,
      totalEquivalentOg: result.canonical.totalEquivalentOriginalGravity,
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

  readonly gravityNotices = computed<Notice[]>(() =>
    (this.result()?.canonical.gravityWarnings ?? []).map((warning) => ({
      id: warning.code,
      tone: warning.severity,
      title: warning.title,
      message: warning.message,
      action: warning.action,
      source: GRAVITY_NOTICE_SCOPE,
      placement: 'both',
    })),
  );

  readonly stepFeedNotices = computed<Notice[]>(() =>
    (this.result()?.canonical.stepFeedingSchedule.warnings ?? []).map((warning) => ({
      id: warning.code,
      tone: warning.severity,
      title: warning.title,
      message: warning.message,
      action: warning.action,
      source: STEP_FEED_NOTICE_SCOPE,
      placement: 'both',
    })),
  );

  readonly summaryNotices = this.noticeService.all;

  readonly volumeUnit = computed<'L' | 'gal'>(() => (this.unitSystem() === 'us' ? 'gal' : 'L'));

  readonly selectedYeastHelper = computed(() => {
    const yeast = this.selectedYeast();

    if (!yeast) {
      return 'Open Advanced and enter valid custom yeast details.';
    }

    return `${yeast.alcoholTolerancePercent.toFixed(1)}% tolerance · ${yeast.nitrogenRequirement} nitrogen requirement`;
  });

  readonly setupViewModel = computed<PlannerSetupViewModel>(() => ({
    batchVolume: this.batchVolume(),
    volumeUnit: this.volumeUnit(),
    targetAbvPercent: this.targetAbvPercent(),
    unitSystem: this.unitSystem(),
    selectedYeastName: this.selectedYeast()?.name ?? 'Enter valid values',
    selectedYeastHelper: this.selectedYeastHelper(),
  }));

  readonly initialMustViewModel = computed<PlannerInitialMustViewModel>(() => {
    const result = this.result();

    if (!result) {
      return {
        valid: false,
        notices: [],
        rows: this.neutralInitialMustRows(),
      };
    }

    const display = result.display;
    const honeyUnit = display.honeyWeightUnit === 'pounds' ? 'lb' : 'kg';
    const hasRemainingHoney = display.remainingHoneyWeight > 0.000_001;

    return {
      valid: true,
      notices: this.gravityNotices(),
      rows: [
        {
          label: 'Initial honey',
          value: `${display.initialHoneyWeight.toFixed(2)} ${honeyUnit}`,
          helper: 'Add this amount before pitching the yeast.',
        },
        {
          label: 'Remaining honey',
          value: `${display.remainingHoneyWeight.toFixed(2)} ${honeyUnit}`,
          helper: hasRemainingHoney
            ? 'Reserve this amount for step feeding.'
            : 'No step feeding is needed for this gravity.',
        },
        {
          label: 'Initial OG',
          value: display.initialOriginalGravity.toFixed(3),
          helper:
            result.canonical.initialOgMode === 'automatic'
              ? `Automatic pitch gravity, capped at ${result.canonical.automaticInitialOgCap.toFixed(3)}.`
              : 'Manual initial pitch gravity.',
        },
        {
          label: 'Total equivalent OG',
          value: display.totalEquivalentOriginalGravity.toFixed(3),
          helper: 'Theoretical OG if all planned honey were added at once.',
        },
        {
          label: 'Total honey needed',
          value: `${display.totalHoneyWeight.toFixed(2)} ${honeyUnit}`,
        },
        {
          label: 'Estimated ABV',
          value: `${display.estimatedAbvPercent.toFixed(1)}%`,
          helper: `Assumes fermentation reaches ${display.estimatedFinalGravity.toFixed(3)} FG.`,
        },
      ],
    };
  });

  readonly stepFeedsViewModel = computed<PlannerStepFeedsViewModel>(() => {
    const result = this.result();

    if (!result) {
      return {
        valid: false,
        hasFeeds: false,
        summary: 'Enter valid values to calculate step feeds.',
        feeds: [],
        notices: [],
      };
    }

    const schedule = result.canonical.stepFeedingSchedule;

    if (schedule.feeds.length === 0) {
      return {
        valid: true,
        hasFeeds: false,
        summary: 'No step feeding required for this plan.',
        feeds: [],
        notices: this.stepFeedNotices(),
      };
    }

    return {
      valid: true,
      hasFeeds: true,
      summary: `${schedule.feedCount} equal ${schedule.feedCount === 1 ? 'feed' : 'feeds'} from the reserved honey.`,
      feeds: schedule.feeds.map((feed) => ({
        feedNumber: feed.feedNumber,
        honeyAmount: this.formatStepFeedHoney(feed.honeyGrams),
        gravityMilestone: feed.gravityMilestone.toFixed(3),
        approximateDayLabel: feed.approximateDayLabel,
        timingGuidance: `Around ${feed.approximateDayLabel}; wait if measured SG has not reached ${feed.gravityMilestone.toFixed(3)}.`,
      })),
      notices: this.stepFeedNotices(),
    };
  });

  readonly resultRows = computed<ResultRow[]>(() => [
    ...this.initialMustViewModel().rows,
    {
      label: 'Selected yeast',
      value: this.setupViewModel().selectedYeastName,
      helper: this.setupViewModel().selectedYeastHelper,
    },
  ]);

  readonly plannerOutput = computed(() => {
    const result = this.result();

    if (!result) {
      return 'Enter valid planner values to generate a brew plan.';
    }

    const display = result.display;
    const honeyUnit = display.honeyWeightUnit === 'pounds' ? 'lb' : 'kg';
    const yeast = this.selectedYeast();
    const tolerance = this.toleranceResult();
    const stepFeeds = this.stepFeedsViewModel();
    const stepFeedLines = stepFeeds.hasFeeds
      ? stepFeeds.feeds.map(
          (feed) =>
            `- Feed ${feed.feedNumber}: add ${feed.honeyAmount} at SG ${feed.gravityMilestone} (${feed.timingGuidance})`,
        )
      : ['- None required.'];

    return [
      '# MeadStep honey-only plan',
      `Batch volume: ${display.batchVolume.toFixed(2)} ${this.volumeUnit()}`,
      `Target ABV: ${result.canonical.targetAbvPercent.toFixed(1)}%`,
      `Initial OG: ${display.initialOriginalGravity.toFixed(3)}`,
      `Total equivalent OG: ${display.totalEquivalentOriginalGravity.toFixed(3)}`,
      `Initial honey: ${display.initialHoneyWeight.toFixed(2)} ${honeyUnit}`,
      `Remaining step-feed honey: ${display.remainingHoneyWeight.toFixed(2)} ${honeyUnit}`,
      `Total honey: ${display.totalHoneyWeight.toFixed(2)} ${honeyUnit}`,
      `Estimated FG: ${display.estimatedFinalGravity.toFixed(3)}`,
      `Estimated ABV: ${display.estimatedAbvPercent.toFixed(1)}%`,
      yeast
        ? `Yeast: ${yeast.brand} ${yeast.name} (${yeast.alcoholTolerancePercent.toFixed(1)}% tolerance, ${yeast.nitrogenRequirement} nitrogen requirement)`
        : 'Yeast: Enter valid custom yeast values.',
      tolerance ? `Yeast tolerance: ${tolerance.level}` : '',
      tolerance?.estimatedToleranceLimitedFinalGravity !== null &&
      tolerance?.estimatedToleranceLimitedFinalGravity !== undefined
        ? `Tolerance-limited FG hint: ${tolerance.estimatedToleranceLimitedFinalGravity.toFixed(3)}`
        : '',
      '',
      'Step feeds:',
      ...stepFeedLines,
    ]
      .filter(Boolean)
      .join('\n');
  });

  constructor() {
    this.syncNotices();
  }

  setBatchVolume(value: number): void {
    this.batchVolume.set(value);
    this.syncNotices();
  }

  setTargetAbvPercent(value: number): void {
    this.targetAbvPercent.set(value);
    this.syncNotices();
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
      this.syncNotices();
    }
  }

  setInitialOgMode(value: InitialOgMode): void {
    this.initialOgMode.set(initialOgModeSchema.parse(value));
    this.syncNotices();
  }

  setManualInitialOg(value: number): void {
    this.manualInitialOg.set(value);
    this.syncNotices();
  }

  setSelectedYeastId(value: YeastSelectionId): void {
    this.selectedYeastId.set(yeastSelectionIdSchema.parse(value));
    this.syncNotices();
  }

  setCustomYeastName(value: string): void {
    this.customYeastName.set(value);
    this.syncNotices();
  }

  setCustomYeastTolerancePercent(value: number): void {
    this.customYeastTolerancePercent.set(value);
    this.syncNotices();
  }

  setCustomYeastNitrogenRequirement(value: NitrogenRequirement): void {
    this.customYeastNitrogenRequirement.set(value);
    this.syncNotices();
  }

  private neutralInitialMustRows(): ResultRow[] {
    return [
      'Initial honey',
      'Remaining honey',
      'Initial OG',
      'Total equivalent OG',
      'Total honey needed',
      'Estimated ABV',
    ].map((label) => ({
      label,
      value: 'Enter valid values',
    }));
  }

  private formatStepFeedHoney(honeyGrams: number): string {
    if (this.unitSystem() === 'us') {
      const pounds = convertWeight(honeyGrams / 1000, 'kilograms', 'pounds');

      return `${pounds.toFixed(2)} lb`;
    }

    return `${honeyGrams.toFixed(0)} g`;
  }

  private syncNotices(): void {
    this.noticeService.set(YEAST_NOTICE_SCOPE, this.yeastNotices());
    this.noticeService.set(GRAVITY_NOTICE_SCOPE, this.gravityNotices());
    this.noticeService.set(STEP_FEED_NOTICE_SCOPE, this.stepFeedNotices());
  }
}
