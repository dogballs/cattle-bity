import {
  Animation,
  GameObject,
  Rect,
  Sprite,
  SpriteAlignment,
  SpriteRenderer,
  Subject,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class SmallExplosion extends GameObject {
  public readonly renderer = new SpriteRenderer();
  public readonly done = new Subject();
  protected readonly animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      [
        SpriteFactory.asOne('explosion.small.1', new Rect(0, 0, 44, 44)),
        SpriteFactory.asOne('explosion.small.2', new Rect(0, 0, 60, 60)),
        SpriteFactory.asOne('explosion.small.3', new Rect(0, 0, 64, 64)),
      ],
      { delay: 3, loop: false },
    );

    this.renderer.alignment = SpriteAlignment.Center;
  }

  public update(): void {
    if (this.animation.isComplete()) {
      this.removeSelf();
      this.done.notify();
      return;
    }

    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
