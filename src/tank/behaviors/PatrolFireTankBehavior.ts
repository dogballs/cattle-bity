import { GameObjectUpdateArgs } from '../../game';
import { Tank } from '../../gameObjects';

import { PatrolTankBehavior } from './PatrolTankBehavior';

export class PatrolFireTankBehavior extends PatrolTankBehavior {
  public update(tank: Tank, updateArgs: GameObjectUpdateArgs): void {
    super.update(tank, updateArgs);

    tank.fire();
  }
}
