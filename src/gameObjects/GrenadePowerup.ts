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

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public collide(): void {
    // scene remove all tanks
    /*
    const powerup = this.collision.target;

    powerup.removeSelf();

    const enemyTanks = this.scene.getChildrenOfType(EnemyTank);
    enemyTanks.forEach((enemyTank) => {
      const tankExplosion = new TankExplosion();
      tankExplosion.setCenterFrom(enemyTank);
      tankExplosion.onComplete = (): void => {
        tankExplosion.removeSelf();
      };
      enemyTank.replaceSelf(tankExplosion);
    });
     */
  }
}
