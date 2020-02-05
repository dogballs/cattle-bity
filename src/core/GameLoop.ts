export interface GameLoopOptions {
  /**
   * Add extra delay for each tick (in number of ticks)
   */
  // delay?: number;
  onTick?: () => void;
}

export const DEFAULT_GAME_LOOP_OPTIONS = {
  // delay: 0,
  onTick: (): void => undefined,
};

export class GameLoop {
  public readonly options: GameLoopOptions;

  constructor(options: GameLoopOptions = {}) {
    this.options = Object.assign({}, DEFAULT_GAME_LOOP_OPTIONS, options);
  }

  public start(): void {
    this.loop();
  }

  // For manual looping
  public next(): void {
    this.options.onTick();
  }

  public skip(ticks: number): void {
    for (let i = 0; i < ticks; i += 1) {
      this.next();
    }
  }

  private loop = (): void => {
    this.options.onTick();

    window.requestAnimationFrame(this.loop);
  };
}
