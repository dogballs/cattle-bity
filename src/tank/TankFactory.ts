import {
  EnemyTank,
  EnemyBasicTank,
  EnemyFastTank,
  PlayerTank,
} from '../gameObjects';

import { TankColor } from './TankColor';
import { TankParty } from './TankParty';
import { TankTier } from './TankTier';
import { TankType } from './TankType';

export class TankFactory {
  public static createPlayer(): PlayerTank {
    return new PlayerTank();
  }

  public static createEnemy(tier: TankTier, hasDrop = false): EnemyTank {
    switch (tier) {
      case TankTier.B:
        return new EnemyFastTank(hasDrop);
      case TankTier.A:
      default:
        return new EnemyBasicTank(hasDrop);
    }
  }

  public static createEnemyType(tier: TankTier, hasDrop = false): TankType {
    return new TankType(TankParty.Enemy, TankColor.Default, tier, hasDrop);
  }
}
