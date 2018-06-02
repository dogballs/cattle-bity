class Animation {
  constructor(frames = [], { delay = 0, loop = true } = {}) {
    this.frames = frames;
    this.frameIndex = 0;

    this.delay = delay;
    this.lastAnimatedAt = performance.now();

    this.loop = loop;
    this.loopIndex = 1;
  }

  getCurrentFrame() {
    return this.frames[this.frameIndex];
  }

  animate() {
    // If looping is disabled and last frame animation is complete - nothing else
    // to animate
    if (this.loop === false
      && this.isLastFrame()
      && this.isCurrentFrameAnimated()
    ) {
      return;
    }

    // If loop is limited to number and we are on the last loop and last frame
    // animation is complete - nothing else to animate
    if (typeof this.loop === 'number'
      && this.loopIndex === this.loop
      && this.isLastFrame()
      && this.isCurrentFrameAnimated()
    ) {
      return;
    }

    // Debounces animation to create a delay between frames.
    // If enough time has not passed yet from the last animation - do nothing.
    if (!this.isCurrentFrameAnimated()) {
      return;
    }

    // Go to the next frame

    this.frameIndex += 1;
    if (this.frameIndex > this.frames.length - 1) {
      this.frameIndex = 0;
      // When frame is reset to the first one, consider one animation loop complete
      this.loopIndex += 1;
    }

    this.lastAnimatedAt = performance.now();
  }

  isCurrentFrameAnimated() {
    const now = performance.now();
    const isAnimated = this.lastAnimatedAt + this.delay < now;
    return isAnimated;
  }

  isLastFrame() {
    return this.frameIndex === this.frames.length - 1;
  }

  isComplete() {
    // Looped animation can not end
    if (this.loop === true) {
      return false;
    }

    // If loop is limited by number of times and it hasn't looped all times yet
    // animation is not complete.
    if (typeof this.loop === 'number' && this.loopIndex !== this.loop) {
      return false;
    }

    if (!this.isLastFrame()) {
      return false;
    }

    // Make sure last frame is displayed on the screen for required amount
    // of time. Only after that set animation as complete.
    const isComplete = this.isCurrentFrameAnimated();

    return isComplete;
  }
}

export default Animation;
