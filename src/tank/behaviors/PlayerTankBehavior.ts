import { GameUpdateArgs, Rotation } from '../../game';
import { PlayerTank, TankState } from '../../gameObjects';
import { LevelPlayInputContext } from '../../input';

import { TankBehavior } from '../TankBehavior';

const MOVE_CONTROLS = [
  ...LevelPlayInputContext.MoveUp,
  ...LevelPlayInputContext.MoveDown,
  ...LevelPlayInputContext.MoveLeft,
  ...LevelPlayInputContext.MoveRight,
];

export class PlayerTankBehavior extends TankBehavior {
  public update(tank: PlayerTank, updateArgs: GameUpdateArgs): void {
    const { deltaTime, inputManager, session } = updateArgs;

    let inputMethod = inputManager.getActiveMethod();

    // If multiplayer - use user-specific input variant based on player index
    if (session.isMultiplayer()) {
      const playerSession = session.getPlayer(tank.partyIndex);
      const playerInputVariant = playerSession.getInputVariant();
      inputMethod = inputManager.getMethodByVariant(playerInputVariant);
    }

    // WARNING: order is important. Make sure to keep fire updates before
    // movement updates. Fire places bullet based on tank position.
    // Tank position changes during movement, and later can be corrected by
    // collision resolution algorithm after update phase. This order issue
    // can be fixed by adding some post-collide callback and place fire code
    // in there.
    if (inputMethod.isDownAny(LevelPlayInputContext.Fire)) {
      tank.fire();
    }
    if (inputMethod.isHoldAny(LevelPlayInputContext.RapidFire)) {
      tank.fire();
    }

    if (!tank.isSliding()) {
      if (inputMethod.isHoldLastAny(LevelPlayInputContext.MoveUp)) {
        tank.rotate(Rotation.Up);
      }
      if (inputMethod.isHoldLastAny(LevelPlayInputContext.MoveDown)) {
        tank.rotate(Rotation.Down);
      }
      if (inputMethod.isHoldLastAny(LevelPlayInputContext.MoveLeft)) {
        tank.rotate(Rotation.Left);
      }
      if (inputMethod.isHoldLastAny(LevelPlayInputContext.MoveRight)) {
        tank.rotate(Rotation.Right);
      }

      if (inputMethod.isHoldAny(MOVE_CONTROLS)) {
        tank.move(deltaTime);
      }
    }

    if (
      inputMethod.isNotHoldAll(MOVE_CONTROLS) &&
      tank.state !== TankState.Idle
    ) {
      tank.idle();
    }
  }
}
