export class Sound {
  public readonly audioElement: HTMLAudioElement;

  constructor(audioElement: HTMLAudioElement) {
    this.audioElement = audioElement;
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
}
