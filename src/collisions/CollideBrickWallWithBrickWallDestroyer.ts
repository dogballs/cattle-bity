import { Collision, GameObject } from '../core';

export class CollideBrickWallWithBrickWallDestroyer {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide(): void {
    const wall = this.collision.target;
    const destroyer = this.collision.source;

    wall.removeSelf();
    destroyer.removeSelf();
  }
}
