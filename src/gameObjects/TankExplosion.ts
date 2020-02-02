import {
  Animation,
  Dimensions,
  GameObject,
  Sprite,
  SpriteMaterial,
  SpriteAlignment,
  Subject,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class TankExplosion extends GameObject {
  public material = new SpriteMaterial();
  public completed = new Subject();
  private readonly animation: Animation<Sprite>;
  private readonly dims: Dimensions[];

  constructor() {
    super(136, 136);

    this.animation = new Animation(
      [
        SpriteFactory.asOne('explosionTank.1', new Dimensions(124, 108)),
        SpriteFactory.asOne('explosionTank.2', new Dimensions(136, 128)),
      ],
      { delay: 4, loop: false },
    );

    this.material.alignment = SpriteAlignment.Center;
  }

  public update(): void {
    if (this.animation.isComplete()) {
      this.completed.notify();
      return;
    }
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }
}
