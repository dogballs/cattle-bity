import Collision from '../core/Collision';
import GameObject from '../core/GameObject';

import Bullet from '../gameObjects/Bullet';
import EnemyTank from '../gameObjects/EnemyTank';
import TankExplosion from '../gameObjects/TankExplosion';

class CollideEnemyTankWithBullet {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide() {
    const tank = this.collision.target as EnemyTank;
    const bullet = this.collision.source as Bullet;

    const nextHealth = tank.health - bullet.damage;
    if (nextHealth > 0) {
      tank.health = nextHealth;
      return;
    }

    this.scene.remove(tank);

    const tankExplosion = new TankExplosion();
    tankExplosion.position = tank.position.clone();
    tankExplosion.onComplete = () => {
      this.scene.remove(tankExplosion);
    };
    this.scene.add(tankExplosion);
  }
}

export default CollideEnemyTankWithBullet;
