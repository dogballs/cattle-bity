import {
  Animation,
  GameObject,
  Rect,
  Sprite,
  SpriteRenderer,
  SpriteAlignment,
  Subject,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Explosion extends GameObject {
  public readonly renderer = new SpriteRenderer();
  public readonly done = new Subject();
  private readonly animation: Animation<Sprite>;

  constructor() {
    super(136, 136);

    this.animation = new Animation(
      [
        SpriteFactory.asOne('explosion.large.1', new Rect(0, 0, 124, 108)),
        SpriteFactory.asOne('explosion.large.2', new Rect(0, 0, 136, 128)),
      ],
      { delay: 4, loop: false },
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
