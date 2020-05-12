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

    let inputVariant = inputManager.getActiveVariant();

    // If multiplayer - use user-specific input variant based on player index
    if (session.isMultiplayer()) {
      const playerSession = session.getPlayer(tank.partyIndex);
      const playerInputVariantType = playerSession.getInputVariantType();
      inputVariant = inputManager.getVariant(playerInputVariantType);
    }

    // WARNING: order is important. Make sure to keep fire updates before
    // movement updates. Fire places bullet based on tank position.
    // Tank position changes during movement, and later can be corrected by
    // collision resolution algorithm after update phase. This order issue
    // can be fixed by adding some post-collide callback and place fire code
    // in there.
    if (inputVariant.isDownAny(LevelPlayInputContext.Fire)) {
      tank.fire();
    }
    if (inputVariant.isHoldAny(LevelPlayInputContext.RapidFire)) {
      tank.fire();
    }

    if (!tank.isSliding()) {
      if (inputVariant.isHoldLastAny(LevelPlayInputContext.MoveUp)) {
        tank.rotate(Rotation.Up);
      }
      if (inputVariant.isHoldLastAny(LevelPlayInputContext.MoveDown)) {
        tank.rotate(Rotation.Down);
      }
      if (inputVariant.isHoldLastAny(LevelPlayInputContext.MoveLeft)) {
        tank.rotate(Rotation.Left);
      }
      if (inputVariant.isHoldLastAny(LevelPlayInputContext.MoveRight)) {
        tank.rotate(Rotation.Right);
      }

      if (inputVariant.isHoldAny(MOVE_CONTROLS)) {
        tank.move(deltaTime);
      }
    }

    if (
      inputVariant.isNotHoldAll(MOVE_CONTROLS) &&
      tank.state !== TankState.Idle
    ) {
      tank.idle();
    }
  }
}
