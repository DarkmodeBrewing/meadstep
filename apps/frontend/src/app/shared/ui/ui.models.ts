export interface ResultRow {
  label: string;
  value: string;
  helper?: string;
}

export interface ToggleOption<T extends string = string> {
  label: string;
  value: T;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
}
