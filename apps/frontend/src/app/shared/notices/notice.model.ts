export type NoticeTone = 'info' | 'warning' | 'error';

export interface Notice {
  tone: NoticeTone;
  title: string;
  message: string;
}
