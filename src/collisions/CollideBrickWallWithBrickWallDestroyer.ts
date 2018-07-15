import Collision from '../core/Collision';
import GameObject from '../core/GameObject';

import BrickWallDestroyer from '../gameObjects/BrickWallDestroyer';

class CollideBrickWallWithBrickWallDestroyer {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide() {
    const wall = this.collision.target;
    const destroyer = this.collision.source;

    this.scene.remove(wall);
    this.scene.remove(destroyer);
  }
}

export default CollideBrickWallWithBrickWallDestroyer;
