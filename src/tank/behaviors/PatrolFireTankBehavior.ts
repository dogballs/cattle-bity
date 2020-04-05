import { GameUpdateArgs } from '../../game';
import { Tank } from '../../gameObjects';

import { PatrolTankBehavior } from './PatrolTankBehavior';

export class PatrolFireTankBehavior extends PatrolTankBehavior {
  public update(tank: Tank, updateArgs: GameUpdateArgs): void {
    super.update(tank, updateArgs);

    tank.fire();
  }
}
