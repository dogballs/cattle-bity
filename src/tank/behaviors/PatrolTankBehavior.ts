import { Vector } from '../../core';
import { GameObjectUpdateArgs, Rotation } from '../../game';
import { Tank } from '../../gameObjects';

import { TankBehavior } from './TankBehavior';

export class PatrolTankBehavior extends TankBehavior {
  private lastPosition: Vector = null;

  public update(tank: Tank, updateArgs: GameObjectUpdateArgs): void {
    tank.move(updateArgs.deltaTime);

    if (this.lastPosition !== null && this.lastPosition.equals(tank.position)) {
      if (tank.rotation === Rotation.Up) {
        tank.rotate(Rotation.Down);
      } else if (tank.rotation === Rotation.Down) {
        tank.rotate(Rotation.Up);
      } else if (tank.rotation === Rotation.Left) {
        tank.rotate(Rotation.Right);
      } else if (tank.rotation === Rotation.Right) {
        tank.rotate(Rotation.Left);
      }
      tank.move(updateArgs.deltaTime);
      return;
    }

    this.lastPosition = tank.position.clone();
  }
}
