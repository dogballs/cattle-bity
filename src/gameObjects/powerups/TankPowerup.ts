import { Animation, GameObject, Sprite, SpriteMaterial } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';

export class TankPowerup extends GameObject {
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.animation = new Animation([SpriteFactory.asOne('powerupTank'), null], {
      delay: 5,
      loop: true,
    });
  }

  update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }
}
