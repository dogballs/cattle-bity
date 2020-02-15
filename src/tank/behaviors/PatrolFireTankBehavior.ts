import { Tank } from '../../gameObjects';

import { PatrolTankBehavior } from './PatrolTankBehavior';

export class PatrolFireTankBehavior extends PatrolTankBehavior {
  public update(tank: Tank): void {
    super.update(tank);

    tank.fire();
  }
}
