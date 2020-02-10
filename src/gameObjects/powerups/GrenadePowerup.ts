import { Animation, GameObject, Sprite, SpriteMaterial } from '../../core';
import { EnemyTank } from '../../gameObjects';
import { SpriteFactory } from '../../sprite/SpriteFactory';
import { Tag } from '../../Tag';

export class GrenadePowerup extends GameObject {
  public collider = true;
  public ignorePause = true;
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    // Null as a second frame adds a blink effect
    this.animation = new Animation(
      [SpriteFactory.asOne('powerupGrenade'), null],
      { delay: 7, loop: true },
    );
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(target: GameObject): void {
    if (target.tags.includes(Tag.Player)) {
      this.removeSelf();

      // TODO: ref to parent not nice
      // TODO: is this logic even ok here?
      const enemyTanks = this.parent.getChildrenWithTag([
        Tag.Tank,
        Tag.Enemy,
      ]) as EnemyTank[];

      enemyTanks.forEach((enemyTank) => {
        // Enemy with drop cant drop it when killed by another powerup
        enemyTank.discardDrop();
        enemyTank.explode();
      });
    }
  }
}
