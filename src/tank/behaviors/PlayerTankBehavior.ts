import { GameObjectUpdateArgs, KeyboardKey, Rotation, Sound } from '../../core';
import { Tank, TankState } from '../../gameObjects';

import { TankBehavior } from './TankBehavior';

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
    if (input.isHoldLast(KeyboardKey.W)) {
      tank.rotate(Rotation.Up);
    }
    if (input.isHoldLast(KeyboardKey.S)) {
      tank.rotate(Rotation.Down);
    }
    if (input.isHoldLast(KeyboardKey.A)) {
      tank.rotate(Rotation.Left);
    }
    if (input.isHoldLast(KeyboardKey.D)) {
      tank.rotate(Rotation.Right);
    }

    const moveKeys = [
      KeyboardKey.W,
      KeyboardKey.A,
      KeyboardKey.S,
      KeyboardKey.D,
    ];

    if (input.isHoldAny(moveKeys)) {
      if (tank.state !== TankState.Moving) {
        this.idleSound.stop();
        this.moveSound.playLoop();
      }
      tank.move();
    }

    if (input.isNotHoldAll(moveKeys) && tank.state !== TankState.Idle) {
      tank.idle();
      this.moveSound.stop();
      this.idleSound.playLoop();
    }

    if (input.isDown(KeyboardKey.Space)) {
      const hasFired = tank.fire();
      if (hasFired) {
        this.fireSound.play();
      }
    }
  }
}
