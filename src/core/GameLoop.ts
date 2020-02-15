export interface GameLoopOptions {
  onTick?: () => void;
}

export const DEFAULT_GAME_LOOP_OPTIONS = {
  onTick: (): void => undefined,
};

export class GameLoop {
  public readonly options: GameLoopOptions;
  private requestedStop = false;

  constructor(options: GameLoopOptions = {}) {
    this.options = Object.assign({}, DEFAULT_GAME_LOOP_OPTIONS, options);
  }

  public start(): void {
    this.loop();
  }

  public stop(): void {
    this.requestedStop = true;
  }

  // For manual looping
  public next(ticks = 1): void {
    for (let i = 0; i < ticks; i += 1) {
      this.options.onTick();
    }
  }

  private loop = (): void => {
    if (this.requestedStop) {
      this.requestedStop = false;
      return;
    }

    this.options.onTick();

    window.requestAnimationFrame(this.loop);
  };
}
