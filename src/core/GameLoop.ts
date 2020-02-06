export interface GameLoopOptions {
  onTick?: () => void;
}

export const DEFAULT_GAME_LOOP_OPTIONS = {
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
