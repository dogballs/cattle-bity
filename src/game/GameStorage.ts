import { LocalStorage } from '../core';
import { AudioManagerSettings } from '../game';
import { InputDeviceType } from '../input';
import * as config from '../config';

export class GameStorage extends LocalStorage {
  public getSeenLevelHint(): boolean {
    const json = this.get(config.STORAGE_KEY_LEVEL_HINT);

    let haveSeen = false;
    try {
      haveSeen = JSON.parse(json);
    } catch (err) {
      // Ignore error
    }

    return haveSeen;
  }

  public saveSeenLevelHint(): void {
    const value = true;
    const json = JSON.stringify(value);
    this.set(config.STORAGE_KEY_LEVEL_HINT, json);
    this.save();
  }

  public getSeenEditorHint(): boolean {
    const json = this.get(config.STORAGE_KEY_EDITOR_HINT);

    let haveSeen = false;
    try {
      haveSeen = JSON.parse(json);
    } catch (err) {
      // Ignore error
    }

    return haveSeen;
  }

  public saveSeenEditorHint(): void {
    const value = true;
    const json = JSON.stringify(value);
    this.set(config.STORAGE_KEY_EDITOR_HINT, json);
    this.save();
  }

  public getAudioSettings(): AudioManagerSettings {
    const json = this.get(config.STORAGE_KEY_SETTINGS_AUDIO);

    let data;
    try {
      data = JSON.parse(json);
    } catch (err) {
      // Ignore error
    }

    // In case there is something else stored in that namespace
    if (typeof data !== 'object' || data === null) {
      data = {};
    }

    const settings: AudioManagerSettings = {};

    if (typeof data.globalMuted === 'boolean') {
      settings.globalMuted = data.globalMuted;
    }

    return settings;
  }

  public saveAudioSettings(settings: AudioManagerSettings): void {
    const json = JSON.stringify(settings);

    this.set(config.STORAGE_KEY_SETTINGS_AUDIO, json);
    this.save();
  }

  public getPrimaryPoints(): number {
    const json = this.get(config.STORAGE_KEY_HIGHSCORE_PRIMARY);
    const points = Number(json) || 0;

    return points;
  }

  public savePrimaryPoints(points: number): void {
    const json = points.toString();

    this.set(config.STORAGE_KEY_HIGHSCORE_PRIMARY, json);
    this.save();
  }

  public getBindingJSON(deviceType: InputDeviceType): string {
    const key = this.getBindingKey(deviceType);
    const json = this.get(key);
    return json;
  }

  public saveBindingJSON(deviceType: InputDeviceType, json: string): void {
    const key = this.getBindingKey(deviceType);

    this.set(key, json);
    this.save();
  }

  private getBindingKey(deviceType: InputDeviceType): string {
    return `${config.STORAGE_KEY_BINDINGS_PRIMARY}_${deviceType.toString()}`;
  }
}
