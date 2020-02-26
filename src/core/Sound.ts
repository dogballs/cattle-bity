import { Subject } from './Subject';

export class Sound {
  public readonly loaded = new Subject();
  public readonly audioElement: HTMLAudioElement;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
    this.audioElement.addEventListener('loadeddata', this.handleLoaded);
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

  private handleLoaded = (): void => {
    this.loaded.notify();
    this.audioElement.removeEventListener('loadeddata', this.handleLoaded);
  };
}
