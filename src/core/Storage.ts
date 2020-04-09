export interface Storage {
  set(key: string, value: string): void;
  get(key: string): string;
  load(): void;
  save(): void;
}
