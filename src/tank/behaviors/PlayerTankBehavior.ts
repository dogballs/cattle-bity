import { Sound } from '../../core';
import { GameObjectUpdateArgs, Rotation } from '../../game';
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
  private fireSound: Sound;
  private moveSound: Sound;
  private idleSound: Sound;

  public setup(tank: Tank, { audioLoader }: GameObjectUpdateArgs): void {
    this.fireSound = audioLoader.load('fire');
    this.moveSound = audioLoader.load('tank.move');
    this.idleSound = audioLoader.load('tank.idle');
  }

  public update(tank: Tank, { deltaTime, input }: GameObjectUpdateArgs): void {
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
      if (tank.state !== TankState.Moving) {
        this.idleSound.stop();
        this.moveSound.playLoop();
      }
      tank.move(deltaTime);
    }

    if (input.isNotHoldAll(MOVE_CONTROLS) && tank.state !== TankState.Idle) {
      tank.idle();
      this.moveSound.stop();
      this.idleSound.playLoop();
    }

    if (input.isDownAny(LevelInputContext.Fire)) {
      const hasFired = tank.fire();
      if (hasFired) {
        this.fireSound.play();
      }
    }
  }
}
