import { AudioLoader, Sound } from '../core';

export class AudioController {
  private audioLoader: AudioLoader;

  constructor(audioLoader: AudioLoader) {
    this.audioLoader = audioLoader;
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

  private getLoadedSounds(): Sound[] {
    return this.audioLoader.getAllLoaded();
  }
}
