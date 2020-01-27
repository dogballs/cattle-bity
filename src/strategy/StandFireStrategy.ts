import { Tank } from '../gameObjects';

import { Strategy } from './Strategy';

export class StandFireStrategy extends Strategy {
  public update(tank: Tank): void {
    tank.fire();
  }
}
