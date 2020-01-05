import { Animation, Dimensions, GameObject, SpriteMaterial } from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class TankExplosion extends GameObject {
  private animation: Animation;
  private dims: Dimensions[];

  constructor() {
    super(124, 108);

    this.animation = new Animation(
      SpriteFactory.asList(['explosionTank.1', 'explosionTank.2']),
      { delay: 100, loop: false },
    );

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dims by centering sprite in box
    this.dims = [new Dimensions(124, 108), new Dimensions(136, 128)];

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

    const frameIndex = this.animation.getCurrentFrameIndex();
    this.dimensions = this.dims[frameIndex];

    const sprite = this.animation.getCurrentFrame();
    this.material.sprite = sprite;
  }
}
