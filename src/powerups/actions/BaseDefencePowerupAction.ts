import { PlayerTank, Powerup, Base } from '../../gameObjects';
import * as config from '../../config';

import { PowerupAction } from '../PowerupAction';

export class BaseDefencePowerupAction extends PowerupAction {
  execute(tank: PlayerTank, powerup: Powerup, base: Base): void {
    base.activateDefence(config.BASE_DEFENCE_POWERUP_DURATION);
  }
}
