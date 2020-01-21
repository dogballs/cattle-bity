import {
  Animation,
  Dimensions,
  GameObject,
  Sprite,
  SpriteAlignment,
  SpriteMaterial,
} from './../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Spawn extends GameObject {
  public material: SpriteMaterial = new SpriteMaterial();
  private animation: Animation<Sprite>;
  private dims: Dimensions[];

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

  // TODO: @mradionov rethink how to notify parent when animation is ended
  // eslint-disable-next-line class-methods-use-this
  public onComplete(): void {
    return undefined;
  }

  public update({ ticks }): void {
    if (this.animation.isComplete()) {
      this.onComplete();
      return;
    }

    this.animation.animate(ticks);
    this.material.sprite = this.animation.getCurrentFrame();
  }
}
