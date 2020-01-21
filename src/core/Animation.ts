export class Animation<T> {
  private delay: number;
  private frameIndex: number;
  private frames: T[];
  private loop: boolean | number;
  private loopIndex: number;

  private startTicks = -1;
  private lastTicks = -1;

  constructor(
    frames: T[] = [],
    {
      delay = 0,
      loop = false,
    }: { delay?: number; loop?: number | boolean } = {},
  ) {
    this.frames = frames;
    this.frameIndex = 0;

    this.delay = delay;

    this.loop = loop;
    this.loopIndex = 0;
  }

  public getCurrentFrame(): T {
    return this.frames[this.frameIndex];
  }

  public getCurrentFrameIndex(): number {
    return this.frameIndex;
  }

  public isComplete(): boolean {
    // Looped animation can not end
    if (this.isLoopInfinite()) {
      return false;
    }

    // If loop is limited by number of times and it hasn't looped all times yet
    // animation is not complete.
    if (this.isLoopFinite() && !this.isLastLoop()) {
      return false;
    }

    if (!this.isLastFrame()) {
      return false;
    }

    // Make sure last frame is displayed on the screen for required amount
    // of tics including delay. Only after that set animation as complete.
    const isComplete = this.isCurrentFrameComplete();
    return isComplete;
  }

  public animate(ticks: number): void {
    // Record when entire animation has started. First frame will be shown for
    // at least one tick
    if (this.startTicks === -1) {
      this.startTicks = ticks;
      this.lastTicks = ticks;
      return;
    }

    // If looping is disabled and last frame animation is complete - nothing else
    // to animate
    if (
      this.isLoopDisabled() &&
      this.isLastFrame() &&
      this.isCurrentFrameComplete()
    ) {
      return;
    }

    // If loop is limited to number and we are on the last loop and last frame
    // animation is complete - nothing else to animate
    if (
      this.isLoopFinite() &&
      this.isLastLoop() &&
      this.isLastFrame() &&
      this.isCurrentFrameComplete()
    ) {
      this.lastTicks = ticks;
      return;
    }

    // Debounces animation to create a delay between frames.
    // If enough ticks has not passed yet from the last animation - wait.
    if (!this.isCurrentFrameComplete()) {
      this.lastTicks = ticks;
      return;
    }

    // Go to the next frame
    this.frameIndex += 1;
    if (this.frameIndex > this.frames.length - 1) {
      this.frameIndex = 0;
      // When frame is reset to the first one, consider one animation loop complete
      this.loopIndex += 1;
    }

    this.lastTicks = ticks;
  }

  private isCurrentFrameComplete(): boolean {
    // By default each frame will have 1 tick guaranteed
    const minFrameTicks = 1;

    // Delay adds up to default min ticks
    const singleFrameTicks = minFrameTicks + this.delay;

    // Sum ticks for all frames including current in one cycle
    const passedFrameTicks =
      (this.loopIndex * this.frames.length + this.frameIndex + 1) *
        singleFrameTicks -
      1;

    const isComplete = this.lastTicks >= this.startTicks + passedFrameTicks;

    return isComplete;
  }

  private isLastFrame(): boolean {
    return this.frameIndex === this.frames.length - 1;
  }

  private isLoopInfinite(): boolean {
    return this.loop === true;
  }

  private isLoopFinite(): boolean {
    return typeof this.loop === 'number';
  }

  private isLoopDisabled(): boolean {
    return this.loop === false;
  }

  private isLastLoop(): boolean {
    return this.loopIndex + 1 === this.loop;
  }
}
