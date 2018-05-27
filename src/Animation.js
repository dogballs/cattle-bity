class Animation {
  constructor(frames = []) {
    this.frames = frames;

    this.frameIndex = 0;
  }

  animate() {
    this.frameIndex += 1;
    if (this.frameIndex > this.frames.length - 1) {
      this.frameIndex = 0;
    }
  }

  getCurrentFrame() {
    return this.frames[this.frameIndex];
  }
}

export default Animation;
