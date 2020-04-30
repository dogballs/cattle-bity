import { GameStorage } from '../game';
import * as config from '../config';

export class InputHintSettings {
  private storage: GameStorage;

  constructor(storage: GameStorage) {
    this.storage = storage;
  }

  public shouldShowLevelHint(): boolean {
    // Set by user in settings
    let shouldShow = this.getShowLevelHint();
    if (shouldShow !== null) {
      return shouldShow;
    }

    // If not set by user we decide based on if user have seen it yet
    const seenHint = this.getSeenLevelHint();

    shouldShow = !seenHint;

    return shouldShow;
  }

  public shouldShowEditorHint(): boolean {
    // Set by user in settings
    let shouldShow = this.getShowEditorHint();
    if (shouldShow !== null) {
      return shouldShow;
    }

    // If not set by user we decide based on if user have seen it yet
    const seenHint = this.getSeenEditorHint();

    shouldShow = !seenHint;

    return shouldShow;
  }

  public setShowLevelHint(show: boolean): void {
    this.storage.setBoolean(config.STORAGE_KEY_SETTINGS_SHOW_LEVEL_HINT, show);
    this.storage.save();
  }

  public getShowLevelHint(): boolean {
    // If not set - null is returned. Three values (true, false, null) needed
    // to create default behavior when user has not made changes to these
    // settings yet.
    return this.storage.getBoolean(
      config.STORAGE_KEY_SETTINGS_SHOW_LEVEL_HINT,
      null,
    );
  }

  public setShowEditorHint(show: boolean): void {
    this.storage.setBoolean(config.STORAGE_KEY_SETTINGS_SHOW_EDITOR_HINT, show);
    this.storage.save();
  }

  public getShowEditorHint(): boolean {
    // If not set - null is returned. Three values (true, false, null) needed
    // to create default behavior when user has not made changes to these
    // settings yet.
    return this.storage.getBoolean(
      config.STORAGE_KEY_SETTINGS_SHOW_EDITOR_HINT,
      null,
    );
  }

  public setSeenLevelHint(): void {
    this.storage.setBoolean(config.STORAGE_KEY_SETTINGS_SEEN_LEVEL_HINT, true);
    this.storage.save();
  }

  public getSeenLevelHint(): boolean {
    return this.storage.getBoolean(
      config.STORAGE_KEY_SETTINGS_SEEN_LEVEL_HINT,
      false,
    );
  }

  public setSeenEditorHint(): void {
    this.storage.setBoolean(config.STORAGE_KEY_SETTINGS_SEEN_EDITOR_HINT, true);
    this.storage.save();
  }

  public getSeenEditorHint(): boolean {
    return this.storage.getBoolean(
      config.STORAGE_KEY_SETTINGS_SEEN_EDITOR_HINT,
      false,
    );
  }
}
