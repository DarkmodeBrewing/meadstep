export type NoticeTone = 'info' | 'ok' | 'warning' | 'error';
export type NoticePlacement = 'inline' | 'summary' | 'both';

export interface Notice {
  id?: string;
  tone: NoticeTone;
  title: string;
  message: string;
  action?: string;
  source?: string;
  placement?: NoticePlacement;
}
