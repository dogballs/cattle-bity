import { GameObjectUpdateArgs, KeyboardKey, Rotation } from '../core';
import { Tank, TankState } from '../gameObjects';
import { AudioManager } from '../audio/AudioManager';

import { Behavior } from './Behavior';

export class PlayerBehavior extends Behavior {
  // TODO: Is it ok in here?
  private fireAudio = AudioManager.load('fire');
  private moveAudio = AudioManager.load('tankMove');
  private idleAudio = AudioManager.load('tankIdle');

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
        this.idleAudio.stop();
        this.moveAudio.playLoop();
      }
      tank.move();
    }

    if (input.isNotHoldAll(moveKeys) && tank.state !== TankState.Idle) {
      tank.idle();
      this.moveAudio.stop();
      this.idleAudio.playLoop();
    }

    if (input.isDown(KeyboardKey.Space)) {
      const hasFired = tank.fire();
      if (hasFired) {
        this.fireAudio.play();
      }
    }
  }
}
