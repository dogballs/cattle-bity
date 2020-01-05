import { Animation, GameObject, SpriteMaterial } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

export class Shield extends GameObject {
  private animation: Animation;

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      SpriteFactory.asList(['shield.1', 'shield.2']),
      { delay: 50 },
    );

    this.material = new SpriteMaterial();
  }

  public update() {
    this.animation.animate();

    const sprite = this.animation.getCurrentFrame();
    this.material.sprite = sprite;
  }
}
