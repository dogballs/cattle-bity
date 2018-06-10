import BulletExplosion from '../models/BulletExplosion.js';

class CollideBullet {
  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  collide() {
    const bullet = this.collision.target;

    this.scene.remove(bullet);

    const bulletExplosion = new BulletExplosion();
    bulletExplosion.position = bullet.position.clone();
    bulletExplosion.onComplete = () => {
      this.scene.remove(bulletExplosion);
    };
    this.scene.add(bulletExplosion);
  }
}

export default CollideBullet;
