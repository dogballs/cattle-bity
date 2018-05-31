class Animation {
  constructor(frames = [], { delay = 0, loop = true } = {}) {
    this.frames = frames;
    this.delay = delay;
    this.loop = loop;

    this.lastAnimatedAt = performance.now();
    this.frameIndex = 0;
  }

  animate() {
    const now = performance.now();

    // Debounces animation to create a delay between frames if #animate is called
    // too fast.
    // TODO: rethink if it belongs here.

    // Only check delay if it is set
    if (this.delay > 0) {
      // If enough time has not passed yet from the last animation - just wait
      if (this.lastAnimatedAt + this.delay > now) {
        return;
      }
    }

    this.frameIndex += 1;
    if (this.frameIndex > this.frames.length - 1) {
      this.frameIndex = 0;
    }

    this.lastAnimatedAt = now;
  }

  getCurrentFrame() {
    return this.frames[this.frameIndex];
  }

  isComplete() {
    // Looped animation can not end
    if (this.loop) {
      return false;
    }

    const isLastFrame = this.frameIndex === this.frames.length - 1;
    if (!isLastFrame) {
      return false;
    }

    // Make sure last frame is displayed on the screen for required amount
    // of time. Only after that set animation as complete.
    const now = performance.now();
    const isLastFrameComplete = this.lastAnimatedAt + this.delay < now;

    const isComplete = isLastFrameComplete;

    return isComplete;
  }
}

export default Animation;
