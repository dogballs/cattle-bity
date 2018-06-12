import TankExplosion from '../models/TankExplosion.js';

class CollideEnemyTankWithBullet {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const tank = this.collision.target;
    const bullet = this.collision.source;

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
