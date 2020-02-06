import { Rotation, Vector } from '../core';
import { Tank } from '../gameObjects';

import { Behavior } from './Behavior';

export class PatrolBehavior extends Behavior {
  private lastPosition: Vector = null;

  public update(tank: Tank): void {
    tank.move();

    if (this.lastPosition !== null && this.lastPosition.equals(tank.position)) {
      if (tank.rotation === Rotation.Up) {
        tank.rotation = Rotation.Down;
      } else if (tank.rotation === Rotation.Down) {
        tank.rotation = Rotation.Up;
      } else if (tank.rotation === Rotation.Left) {
        tank.rotation = Rotation.Right;
      } else if (tank.rotation === Rotation.Right) {
        tank.rotation = Rotation.Left;
      }
      tank.move();
      return;
    }

    this.lastPosition = tank.position.clone();
  }
}
