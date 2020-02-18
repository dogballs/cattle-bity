import { PlayerTank, EnemyTank } from '../../gameObjects';
import { TankDeathReason } from '../../tank';
import { Tag } from '../../Tag';

import { PowerupAction } from '../PowerupAction';

export class WipeoutPowerupAction extends PowerupAction {
  execute(tank: PlayerTank): void {
    // TODO: ref to parent not nice
    // TODO: is this logic even ok here?
    const enemyTanks = tank.parent.getChildrenWithTag([
      Tag.Tank,
      Tag.Enemy,
    ]) as EnemyTank[];

    enemyTanks.forEach((enemyTank) => {
      // Enemy with drop cant drop it when killed by powerup
      enemyTank.discardDrop();

      // Pass death reason because picking up this powerup does not award
      // per-enemy points. Only powerup pickup points are awarded.
      enemyTank.die(TankDeathReason.WipeoutPowerup);
    });
  }
}
