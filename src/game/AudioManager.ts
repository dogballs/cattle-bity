import { AudioLoader, Sound, Storage } from '../core';
import * as config from '../config';

export class AudioManager {
  private audioLoader: AudioLoader;
  private storage: Storage;
  private globalMuted = false;

  constructor(audioLoader: AudioLoader, storage: Storage) {
    this.audioLoader = audioLoader;
    this.audioLoader.loaded.addListener((sound) => {
      if (this.globalMuted) {
        sound.globalMute();
      }
    });

    this.storage = storage;
  }

  public globalMute(): void {
    this.globalMuted = true;

    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.globalMute();
    });
  }

  public globalUnmute(): void {
    this.globalMuted = false;

    const sounds = this.getLoadedSounds();
    sounds.forEach((sound) => {
      sound.globalUnmute();
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
    const json = this.storage.get(config.STORAGE_KEY_SETTINGS_AUDIO);

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

    if (typeof data.globalMuted === 'boolean') {
      this.globalMuted = data.globalMuted;
    }
  }

  public saveSettings(): void {
    const data = {
      globalMuted: this.globalMuted,
    };

    const json = JSON.stringify(data);

    this.storage.set(config.STORAGE_KEY_SETTINGS_AUDIO, json);
    this.storage.save();
  }

  private getLoadedSounds(): Sound[] {
    return this.audioLoader.getAllLoaded();
  }
}
