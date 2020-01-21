export interface GameLoopOptions {
  /**
   * Add extra delay for each tick (in number of ticks)
   */
  // delay?: number;
  onTick?: (ticks?: number) => void;
}

export const DEFAULT_GAME_LOOP_OPTIONS = {
  // delay: 0,
  onTick: (): void => undefined,
};

export class GameLoop {
  public readonly options: GameLoopOptions;
  // TODO: overflow?
  public ticks = 0;

  constructor(options: GameLoopOptions = {}) {
    this.options = Object.assign({}, DEFAULT_GAME_LOOP_OPTIONS, options);
  }

  public start(): void {
    this.loop();
  }

  // For manual looping
  public next(): void {
    this.ticks += 1;
    this.options.onTick(this.ticks);
  }

  private loop = (): void => {
    this.ticks += 1;
    this.options.onTick(this.ticks);

    window.requestAnimationFrame(this.loop);
  };
}
