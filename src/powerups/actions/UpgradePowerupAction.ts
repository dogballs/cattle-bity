import { PlayerTank } from '../../gameObjects';

import { PowerupAction } from '../PowerupAction';

export class UpgradePowerupAction extends PowerupAction {
  execute(tank: PlayerTank): void {
    tank.upgrade();
  }
}
