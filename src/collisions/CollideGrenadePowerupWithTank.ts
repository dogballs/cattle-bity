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

  public collide() {
    const powerup = this.collision.target;

    this.scene.remove(powerup);

    const enemyTanks = this.scene.getChildrenOfType(EnemyTank);
    enemyTanks.forEach((enemyTank) => {
      const tankExplosion = new TankExplosion();
      this.scene.remove(enemyTank);

      tankExplosion.position = enemyTank.position.clone();
      tankExplosion.onComplete = () => {
        this.scene.remove(tankExplosion);
      };
      this.scene.add(tankExplosion);
    });
  }
}
