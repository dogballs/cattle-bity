import { Animation, Dimensions, GameObject, SpriteMaterial } from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class BulletExplosion extends GameObject {
  private animation: Animation;
  private dims: Dimensions[];

  constructor() {
    super(44, 44);

    this.animation = new Animation(
      SpriteFactory.asList([
        'explosionBullet.1',
        'explosionBullet.2',
        'explosionBullet.3',
      ]),
      { delay: 50, loop: false },
    );

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dims by centering sprite in box
    this.dims = [
      new Dimensions(44, 44),
      new Dimensions(60, 60),
      new Dimensions(64, 64),
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

    const frameIndex = this.animation.getCurrentFrameIndex();
    this.dimensions = this.dims[frameIndex];

    const sprite = this.animation.getCurrentFrame();
    this.material.sprite = sprite;
  }
}
