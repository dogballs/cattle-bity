import { GameUpdateArgs, Rotation } from '../../game';
import { Tank, TankState } from '../../gameObjects';
import { LevelPlayInputContext } from '../../input';

import { TankBehavior } from '../TankBehavior';

const MOVE_CONTROLS = [
  ...LevelPlayInputContext.MoveUp,
  ...LevelPlayInputContext.MoveDown,
  ...LevelPlayInputContext.MoveLeft,
  ...LevelPlayInputContext.MoveRight,
];

export class PlayerTankBehavior extends TankBehavior {
  public update(tank: Tank, { deltaTime, input }: GameUpdateArgs): void {
    // WARNING: order is important. Mkae sure to keep fire updates before
    // movement updates. Fire places bullet based on tank position.
    // Tank position changes during movement, and later can be corrected by
    // collision resolution algorithm after update phase. This order issue
    // can be fixed by adding some post-collide callback and place fire code
    // in there.
    if (input.isDownAny(LevelPlayInputContext.Fire)) {
      tank.fire();
    }
    if (input.isHoldAny(LevelPlayInputContext.RapidFire)) {
      tank.fire();
    }

    if (!tank.isSliding()) {
      if (input.isHoldLastAny(LevelPlayInputContext.MoveUp)) {
        tank.rotate(Rotation.Up);
      }
      if (input.isHoldLastAny(LevelPlayInputContext.MoveDown)) {
        tank.rotate(Rotation.Down);
      }
      if (input.isHoldLastAny(LevelPlayInputContext.MoveLeft)) {
        tank.rotate(Rotation.Left);
      }
      if (input.isHoldLastAny(LevelPlayInputContext.MoveRight)) {
        tank.rotate(Rotation.Right);
      }

      if (input.isHoldAny(MOVE_CONTROLS)) {
        tank.move(deltaTime);
      }
    }

    if (input.isNotHoldAll(MOVE_CONTROLS) && tank.state !== TankState.Idle) {
      tank.idle();
    }
  }
}
