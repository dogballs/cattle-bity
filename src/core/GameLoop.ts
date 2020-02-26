import { Subject } from './Subject';

export class GameLoop {
  public readonly tick = new Subject();
  private requestedStop = false;

  public start(): void {
    this.loop();
  }

  public stop(): void {
    this.requestedStop = true;
  }

  // For manual looping
  public next(ticks = 1): void {
    for (let i = 0; i < ticks; i += 1) {
      this.tick.notify();
    }
  }

  private loop = (): void => {
    if (this.requestedStop) {
      this.requestedStop = false;
      return;
    }

    this.tick.notify();

    window.requestAnimationFrame(this.loop);
  };
}
