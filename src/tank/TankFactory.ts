import {
  EnemyTank,
  EnemyBasicTank,
  EnemyFastTank,
  PlayerTank,
} from '../gameObjects';

import { TankTier } from './TankTier';

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
}
