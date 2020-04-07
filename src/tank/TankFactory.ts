import { EnemyTank, PlayerTank } from '../gameObjects';

import { TankParty } from './TankParty';
import { TankTier } from './TankTier';
import { TankType } from './TankType';

export class TankFactory {
  public static createPlayer(): PlayerTank {
    return new PlayerTank();
  }

  public static createPlayerType(): TankType {
    return TankType.PlayerA();
  }

  public static createEnemy(tier: TankTier, hasDrop = false): EnemyTank {
    const type = this.createEnemyType(tier, hasDrop);

    const tank = new EnemyTank(type);

    return tank;
  }

  public static createEnemyType(tier: TankTier, hasDrop = false): TankType {
    return new TankType(TankParty.Enemy, tier, hasDrop);
  }
}
