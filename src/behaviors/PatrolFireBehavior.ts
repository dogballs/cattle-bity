import { Tank } from '../gameObjects';

import { PatrolBehavior } from './PatrolBehavior';

export class PatrolFireBehavior extends PatrolBehavior {
  public update(tank: Tank): void {
    super.update(tank);

    tank.fire();
  }
}
