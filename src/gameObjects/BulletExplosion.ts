import {
  Animation,
  Dimensions,
  GameObject,
  Sprite,
  SpriteAlignment,
  SpriteRenderer,
  Subject,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class BulletExplosion extends GameObject {
  public renderer = new SpriteRenderer();
  public completed = new Subject();
  private animation: Animation<Sprite>;
  private dims: Dimensions[];

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      [
        SpriteFactory.asOne('explosionBullet.1', new Dimensions(44, 44)),
        SpriteFactory.asOne('explosionBullet.2', new Dimensions(60, 60)),
        SpriteFactory.asOne('explosionBullet.3', new Dimensions(64, 64)),
      ],
      { delay: 3, loop: false },
    );

    this.renderer.alignment = SpriteAlignment.Center;
  }

  public update(): void {
    if (this.animation.isComplete()) {
      this.completed.notify();
      return;
    }

    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
