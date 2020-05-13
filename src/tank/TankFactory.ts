import { EnemyTank, PlayerTank } from '../gameObjects';

import { AiTankBehavior, PlayerTankBehavior } from './behaviors';
import { TankBehavior } from './TankBehavior';
import { TankType } from './TankType';

export class TankFactory {
  public static createPlayer(
    partyIndex: number,
    type: TankType = TankType.PlayerA(),
    behavior: TankBehavior = new PlayerTankBehavior(),
  ): PlayerTank {
    return new PlayerTank(type, behavior, partyIndex);
  }

  public static createPlayerType(): TankType {
    return TankType.PlayerA();
  }

  public static createEnemy(
    partyIndex: number,
    type: TankType = TankType.EnemyA(),
    behavior: TankBehavior = new AiTankBehavior(),
  ): EnemyTank {
    return new EnemyTank(type, behavior, partyIndex);
  }
}
