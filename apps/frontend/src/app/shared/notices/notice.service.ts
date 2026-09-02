import { computed, Injectable, signal } from '@angular/core';
import type { Notice } from './notice.model';

@Injectable({ providedIn: 'root' })
export class NoticeService {
  private readonly noticesByScope = signal<Record<string, Notice[]>>({});

  readonly all = computed(() => Object.values(this.noticesByScope()).flatMap((notices) => notices));

  set(scope: string, notices: Notice[]): void {
    this.noticesByScope.update((current) => ({ ...current, [scope]: notices }));
  }

  clear(scope: string): void {
    this.noticesByScope.update((current) => {
      const next = { ...current };
      delete next[scope];
      return next;
    });
  }
}
