import { AudioLoader, Sound } from '../core';
import { GameStorage } from '../game';

export interface AudioManagerSettings {
  globalMuted?: boolean;
}

const DEFAULT_SETTINGS = {
  globalMuted: false,
};

export class AudioManager {
  private audioLoader: AudioLoader;
  private storage: GameStorage;
  private settings: AudioManagerSettings;

  constructor(audioLoader: AudioLoader, storage: GameStorage) {
    this.settings = Object.assign({}, DEFAULT_SETTINGS);

    this.audioLoader = audioLoader;
    this.audioLoader.loaded.addListener((sound) => {
      if (this.settings.globalMuted) {
        sound.globalMute();
      }
    });

    this.storage = storage;
  }

  public globalMute(): void {
    this.settings.globalMuted = true;

    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.globalMute();
    });
  }

  public globalUnmute(): void {
    this.settings.globalMuted = false;

    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.globalUnmute();
    });
  }

  public isGlobalMuted(): boolean {
    return this.settings.globalMuted;
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
        sound.mute();
      }
    });
  }

  public unmuteAll(): void {
    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.unmute();
    });
  }

  public loadSettings(): void {
    const savedSettings = this.storage.getAudioSettings();

    this.settings = Object.assign({}, this.settings, savedSettings);
  }

  public saveSettings(): void {
    this.storage.saveAudioSettings(this.settings);
  }

  private getLoadedSounds(): Sound[] {
    return this.audioLoader.getAllLoaded();
  }
}
