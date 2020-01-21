import { Collision, GameObject } from '../core';

import { BrickWallDestroyer } from '../gameObjects';

export class CollideBrickWallWithBullet {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide(): void {
    const bullet = this.collision.source;

    const destroyer = new BrickWallDestroyer();
    // TODO: order here matters, rework
    destroyer.rotate(bullet.rotation);
    destroyer.setCenterFrom(bullet);

    bullet.parent.add(destroyer);
  }
}
