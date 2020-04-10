import { Tank } from '../../gameObjects';

import { TankBehavior } from '../TankBehavior';

export class StandFireTankBehavior extends TankBehavior {
  public update(tank: Tank): void {
    tank.fire();
  }
}
