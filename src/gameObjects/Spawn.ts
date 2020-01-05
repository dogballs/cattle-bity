import { Animation, Dimensions, GameObject, SpriteMaterial } from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Spawn extends GameObject {
  private animation: Animation;
  private dims: Dimensions[];

  constructor() {
    super(36, 36);

    this.animation = new Animation(
      SpriteFactory.asList(['spawn.1', 'spawn.2', 'spawn.3', 'spawn.4']),
      { delay: 40, loop: 3 },
    );

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dims by centering sprite in box
    this.dims = [
      new Dimensions(36, 36),
      new Dimensions(44, 44),
      new Dimensions(52, 52),
      new Dimensions(60, 60),
    ];

    this.material = new SpriteMaterial();
  }

  // TODO: @mradionov rethink how to notify parent when animation is ended
  // eslint-disable-next-line class-methods-use-this
  public onComplete() {
    return undefined;
  }

  public update() {
    if (this.animation.isComplete()) {
      this.onComplete();
      return;
    }

    this.animation.animate();

    const sprite = this.animation.getCurrentFrame();
    const frameIndex = this.animation.getCurrentFrameIndex();

    this.dimensions = this.dims[frameIndex];
    this.material.sprite = sprite;
  }
}
