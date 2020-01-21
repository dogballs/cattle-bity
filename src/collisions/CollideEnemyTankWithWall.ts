import { Collision, GameObject } from '../core';

export class CollideEnemyTankWithWall {
  private collision: Collision;
  private scene: GameObject;

  constructor(collision, scene) {
    this.collision = collision;

    // TODO: @mradionov Decouple scene from collisions.
    this.scene = scene;
  }

  public collide(): void {
    const tank = this.collision.target;
    const wall = this.collision.source;

    const wallBoundingBox = wall.getWorldBoundingBox();
    const { width, height } = tank.getComputedDimensions();
    const worldPosition = tank.getWorldPosition();

    // Fix tank position depending on what wall he hits, so the tank won't be
    // able to pass thru the wall.
    if (tank.rotation === GameObject.Rotation.Up) {
      tank.setWorldPosition(worldPosition.clone().setY(wallBoundingBox.max.y));
      tank.rotate(GameObject.Rotation.Down);
    } else if (tank.rotation === GameObject.Rotation.Down) {
      tank.setWorldPosition(
        worldPosition.clone().setY(wallBoundingBox.min.y - height),
      );
      tank.rotate(GameObject.Rotation.Up);
    } else if (tank.rotation === GameObject.Rotation.Left) {
      tank.setWorldPosition(worldPosition.clone().setX(wallBoundingBox.max.x));
    } else if (tank.rotation === GameObject.Rotation.Right) {
      tank.setWorldPosition(
        worldPosition.clone().setX(wallBoundingBox.min.x - width),
      );
    }
  }
}
