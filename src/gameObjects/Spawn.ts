import {
  Animation,
  Dimensions,
  GameObject,
  Sprite,
  SpriteAlignment,
  SpriteMaterial,
  Subject,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Spawn extends GameObject {
  public material = new SpriteMaterial();
  public completed = new Subject();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      [
        SpriteFactory.asOne('spawn.1', new Dimensions(36, 36)),
        SpriteFactory.asOne('spawn.2', new Dimensions(44, 44)),
        SpriteFactory.asOne('spawn.3', new Dimensions(52, 52)),
        SpriteFactory.asOne('spawn.4', new Dimensions(60, 60)),
      ],
      { delay: 3, loop: 3 },
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
