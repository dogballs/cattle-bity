import { EnemyTank, PlayerTank } from '../gameObjects';

import { StandStillTankBehavior, PlayerTankBehavior } from './behaviors';
import { TankBehavior } from './TankBehavior';
import { TankType } from './TankType';

export class TankFactory {
  public static createPlayer(
    type: TankType = TankType.PlayerA(),
    behavior: TankBehavior = new PlayerTankBehavior(),
  ): PlayerTank {
    return new PlayerTank(type, behavior);
  }

  public static createPlayerType(): TankType {
    return TankType.PlayerA();
  }

  public static createEnemy(
    type: TankType = TankType.EnemyA(),
    behavior: TankBehavior = new StandStillTankBehavior(),
  ): EnemyTank {
    return new EnemyTank(type, behavior);
  }
}
