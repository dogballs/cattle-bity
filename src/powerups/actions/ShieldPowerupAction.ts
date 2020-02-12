import { PlayerTank } from '../../gameObjects';
import * as config from '../../config';

import { PowerupAction } from '../PowerupAction';

export class ShieldPowerupAction extends PowerupAction {
  execute(tank: PlayerTank): void {
    tank.activateShield(config.SHIELD_POWERUP_DURATION);
  }
}
