import { KeyboardInput, KeyboardKey, Rotation } from '../core';
import { Tank } from '../gameObjects';

import { Strategy } from './Strategy';

export class PlayerStrategy extends Strategy {
  public update(tank: Tank, input: KeyboardInput): void {
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
      tank.move();
    }

    if (input.isDown(KeyboardKey.Space)) {
      tank.fire();
    }
  }
}
