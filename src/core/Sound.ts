import { Subject } from './Subject';

export class Sound {
  public readonly ended = new Subject();
  public readonly loaded = new Subject();
  public readonly audioElement: HTMLAudioElement;
  private localMuted = false;
  private globalMuted = false;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
    this.audioElement.addEventListener('loadeddata', this.handleLoaded);
    this.audioElement.addEventListener('ended', this.handleEnded);
  }

  public isLoaded(): boolean {
    return this.audioElement.readyState === 4;
  }

  public play(): void {
    this.stop();
    this.audioElement.loop = false;
    this.audioElement.play();
  }

  public playLoop(): void {
    this.stop();
    this.audioElement.loop = true;
    this.audioElement.play();
  }

  public resume(): void {
    this.audioElement.play();
  }

  public pause(): void {
    this.audioElement.pause();
  }

  public stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  public canResume(): boolean {
    // TODO: what if 0?
    return (
      this.audioElement.paused &&
      !this.audioElement.ended &&
      this.audioElement.currentTime > 0
    );
  }

  public setMuted(isMuted: boolean): void {
    this.localMuted = isMuted;
    this.updateElementMuted();
  }

  public isMuted(): boolean {
    return this.localMuted;
  }

  public setGlobalMuted(isGlobalMuted: boolean): void {
    this.globalMuted = isGlobalMuted;
    this.updateElementMuted();
  }

  public isGlobalMuted(): boolean {
    return this.globalMuted;
  }

  private updateElementMuted(): void {
    this.audioElement.muted = this.globalMuted || this.localMuted;
  }

  private handleLoaded = (): void => {
    this.loaded.notify(null);
    this.audioElement.removeEventListener('loadeddata', this.handleLoaded);
  };

  private handleEnded = (): void => {
    this.ended.notify(null);
  };
}
