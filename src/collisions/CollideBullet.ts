import Collision from '../core/Collision';
import GameObject from '../core/GameObject';

import BulletExplosion from '../gameObjects/BulletExplosion';

class CollideBullet {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide() {
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
