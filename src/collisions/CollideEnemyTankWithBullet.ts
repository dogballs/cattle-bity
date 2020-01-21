import { Collision, GameObject } from '../core';

import { Bullet, EnemyTank, TankExplosion } from '../gameObjects';

export class CollideEnemyTankWithBullet {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide(): void {
    const tank = this.collision.target as EnemyTank;
    const bullet = this.collision.source as Bullet;

    const nextHealth = tank.health - bullet.damage;
    if (nextHealth > 0) {
      tank.health = nextHealth;
      return;
    }

    const tankExplosion = new TankExplosion();
    tankExplosion.setCenterFrom(tank);
    tankExplosion.onComplete = (): void => {
      tankExplosion.removeSelf();
    };

    tank.replaceSelf(tankExplosion);
  }
}
