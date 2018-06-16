import EnemyTank from '../models/EnemyTank';
import TankExplosion from '../models/TankExplosion';

class CollideGrenadePowerupWithTank {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const powerup = this.collision.target;

    this.scene.remove(powerup);

    const enemyTanks = this.scene.filterType(EnemyTank);
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

export default CollideGrenadePowerupWithTank;
