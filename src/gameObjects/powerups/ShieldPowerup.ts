import { Animation, GameObject, Sprite, SpriteMaterial } from '../../core';
import { PlayerTank } from '../../gameObjects';
import { SpriteFactory } from '../../sprite/SpriteFactory';
import { Tag } from '../../Tag';
import * as config from '../../config';

export class ShieldPowerup extends GameObject {
  public collider = true;
  public ignorePause = true;
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    // Null as a second frame adds a blink effect
    this.animation = new Animation(
      [SpriteFactory.asOne('powerup.helmet'), null],
      { delay: 7, loop: true },
    );
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Player)) {
      const tank = target as PlayerTank;
      this.removeSelf();
      tank.activateShield(config.SHIELD_POWERUP_DURATION);
    }
  }
}
