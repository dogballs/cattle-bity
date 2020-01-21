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

  public collide(): void {
    const bullet = this.collision.target;

    const bulletExplosion = new BulletExplosion();
    bulletExplosion.setCenterFrom(bullet);
    bulletExplosion.onComplete = (): void => {
      bulletExplosion.removeSelf();
    };

    bullet.replaceSelf(bulletExplosion);
  }
}
