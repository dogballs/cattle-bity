import { GameObjectUpdateArgs, Rotation, Sound } from '../../core';
import { Tank, TankState } from '../../gameObjects';
import { InputControl } from '../../input';

import { TankBehavior } from './TankBehavior';

const MOVE_CONTROLS = [
  InputControl.Up,
  InputControl.Down,
  InputControl.Left,
  InputControl.Right,
];

const FIRE_CONTROLS = [
  InputControl.A,
  InputControl.B,
  InputControl.TurboA,
  InputControl.TurboB,
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

  public update(tank: Tank, { input }: GameObjectUpdateArgs): void {
    if (input.isHoldLast(InputControl.Up)) {
      tank.rotate(Rotation.Up);
    }
    if (input.isHoldLast(InputControl.Down)) {
      tank.rotate(Rotation.Down);
    }
    if (input.isHoldLast(InputControl.Left)) {
      tank.rotate(Rotation.Left);
    }
    if (input.isHoldLast(InputControl.Right)) {
      tank.rotate(Rotation.Right);
    }

    if (input.isHoldAny(MOVE_CONTROLS)) {
      if (tank.state !== TankState.Moving) {
        this.idleSound.stop();
        this.moveSound.playLoop();
      }
      tank.move();
    }

    if (input.isNotHoldAll(MOVE_CONTROLS) && tank.state !== TankState.Idle) {
      tank.idle();
      this.moveSound.stop();
      this.idleSound.playLoop();
    }

    if (input.isDownAny(FIRE_CONTROLS)) {
      const hasFired = tank.fire();
      if (hasFired) {
        this.fireSound.play();
      }
    }
  }
}
