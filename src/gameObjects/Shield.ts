import { Animation, GameObject, Sprite, SpriteMaterial } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Shield extends GameObject {
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      SpriteFactory.asList(['shield.1', 'shield.2']),
      { delay: 3, loop: true },
    );
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }
}
