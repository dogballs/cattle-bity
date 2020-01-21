import { Collision, GameObject } from '../core';

import { EnemyTank, TankExplosion } from '../gameObjects';

export class CollideGrenadePowerupWithTank {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide(): void {
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
  }
}
