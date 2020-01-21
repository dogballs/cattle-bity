import { Animation, GameObject, Sprite, SpriteMaterial } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class GrenadePowerup extends GameObject {
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    // Null as a second frame adds a blink effect
    this.animation = new Animation(
      [SpriteFactory.asOne('powerupGrenade'), null],
      { delay: 5, loop: true },
    );

    this.material = new SpriteMaterial();
  }

  public update({ ticks }): void {
    this.animation.animate(ticks);
    this.material.sprite = this.animation.getCurrentFrame();
  }
}
