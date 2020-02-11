import { Animation, GameObject, Sprite, SpriteMaterial } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';
import { Tag } from '../../Tag';

export class LifePowerup extends GameObject {
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.animation = new Animation(
      [SpriteFactory.asOne('powerup.tank'), null],
      {
        delay: 5,
        loop: true,
      },
    );
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Player)) {
      console.log('collide');
    }
  }
}
