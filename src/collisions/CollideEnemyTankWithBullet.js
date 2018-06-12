import TankExplosion from '../models/TankExplosion.js';

class CollideEnemyTankWithBullet {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const tank = this.collision.target;

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
