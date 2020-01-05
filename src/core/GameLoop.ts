export interface GameLoopOptions {
  /**
   * Add delay for each frame in milliseconds
   */
  frameDelay?: number;
  onFrame?: () => void;
}

export const DEFAULT_GAME_LOOP_OPTIONS = {
  frameDelay: 0,
  onFrame: (): void => undefined,
};

export class GameLoop {
  public readonly options: GameLoopOptions;
  private lastFrameTime = 0;

  constructor(options: GameLoopOptions = {}) {
    this.options = Object.assign({}, DEFAULT_GAME_LOOP_OPTIONS, options);
  }

  public start(): void {
    this.animate();
  }

  private animate = (time = 0): void => {
    // Throttle animation
    if (time < this.lastFrameTime + this.options.frameDelay) {
      window.requestAnimationFrame(this.animate);
      return;
    }

    this.lastFrameTime = time;

    this.options.onFrame();

    window.requestAnimationFrame(this.animate);
  };
}
