import { Collision, GameObject } from '../core';

import { BulletExplosion } from '../gameObjects';

export class CollideBullet {
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
