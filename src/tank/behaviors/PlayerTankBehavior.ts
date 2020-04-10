import { GameUpdateArgs, Rotation } from '../../game';
import { Tank, TankState } from '../../gameObjects';
import { LevelInputContext } from '../../input';

import { TankBehavior } from './TankBehavior';

const MOVE_CONTROLS = [
  ...LevelInputContext.MoveUp,
  ...LevelInputContext.MoveDown,
  ...LevelInputContext.MoveLeft,
  ...LevelInputContext.MoveRight,
];

export class PlayerTankBehavior extends TankBehavior {
  public update(tank: Tank, { deltaTime, input }: GameUpdateArgs): void {
    if (input.isHoldLastAny(LevelInputContext.MoveUp)) {
      tank.rotate(Rotation.Up);
    }
    if (input.isHoldLastAny(LevelInputContext.MoveDown)) {
      tank.rotate(Rotation.Down);
    }
    if (input.isHoldLastAny(LevelInputContext.MoveLeft)) {
      tank.rotate(Rotation.Left);
    }
    if (input.isHoldLastAny(LevelInputContext.MoveRight)) {
      tank.rotate(Rotation.Right);
    }

    if (input.isHoldAny(MOVE_CONTROLS)) {
      tank.move(deltaTime);
    }

    if (input.isNotHoldAll(MOVE_CONTROLS) && tank.state !== TankState.Idle) {
      tank.idle();
    }

    if (input.isDownAny(LevelInputContext.Fire)) {
      tank.fire();
    }

    if (input.isHoldAny(LevelInputContext.RapidFire)) {
      tank.fire();
    }
  }
}
