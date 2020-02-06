import { Tank } from '../gameObjects';

import { Behavior } from './Behavior';

export class StandFireBehavior extends Behavior {
  public update(tank: Tank): void {
    tank.fire();
  }
}
