import { AudioLoader, Sound } from '../core';
import { GameStorage } from '../game';
import * as config from '../config';

export class AudioManager {
  private audioLoader: AudioLoader;
  private storage: GameStorage;
  private globalMuted = false;

  constructor(audioLoader: AudioLoader, storage: GameStorage) {
    this.audioLoader = audioLoader;
    this.audioLoader.loaded.addListener((sound) => {
      sound.setGlobalMuted(this.globalMuted);
    });

    this.storage = storage;
  }

  public setGlobalMuted(isGlobalMuted: boolean): void {
    this.globalMuted = isGlobalMuted;

    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.setGlobalMuted(isGlobalMuted);
    });
  }

  public isGlobalMuted(): boolean {
    return this.globalMuted;
  }

  public play(soundId: string): void {
    const sound = this.audioLoader.load(soundId);
    sound.play();
  }

  public playLoop(soundId: string): void {
    const sound = this.audioLoader.load(soundId);
    sound.playLoop();
  }

  public stop(soundId: string): void {
    const sound = this.audioLoader.load(soundId);
    sound.stop();
  }

  public pauseAll(): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.pause();
    });
  }

  public resumeAll(): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      if (sound.canResume()) {
        sound.resume();
      }
    });
  }

  public stopAll(): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.stop();
    });
  }

  public muteAllExcept(...exceptSounds: Sound[]): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      if (!exceptSounds.includes(sound)) {
        sound.setMuted(true);
      }
    });
  }

  public unmuteAll(): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.setMuted(false);
    });
  }

  public loadSettings(): void {
    this.globalMuted = this.storage.getBoolean(
      config.STORAGE_KEY_SETTINGS_AUDIO_MUTED,
      false,
    );
  }

  public saveSettings(): void {
    this.storage.setBoolean(
      config.STORAGE_KEY_SETTINGS_AUDIO_MUTED,
      this.globalMuted,
    );
    this.storage.save();
  }

  private getLoadedSounds(): Sound[] {
    return this.audioLoader.getAllLoaded();
  }
}
