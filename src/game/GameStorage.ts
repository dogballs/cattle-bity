import { LocalStorage } from '../core';

export class GameStorage extends LocalStorage {
  public setBoolean(key: string, value: boolean): void {
    this.set(key, value.toString());
  }

  public getBoolean(key: string, defaultValue = null): boolean {
    const json = this.get(key);

    let value = defaultValue;

    try {
      value = JSON.parse(json);
    } catch (err) {
      // Not parse-able
    }

    if (typeof value !== 'boolean') {
      return defaultValue;
    }

    return value;
  }

  public setNumber(key: string, value: number): void {
    this.set(key, value.toString());
  }

  public getNumber(key: string, defaultValue = null): number {
    const json = this.get(key);

    let value = defaultValue;

    try {
      value = JSON.parse(json);
    } catch (err) {
      // Not parse-able
    }

    if (typeof value !== 'number') {
      return defaultValue;
    }

    return value;
  }
}
