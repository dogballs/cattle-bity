import { KeyboardInput } from '../core';
import { Tank } from '../gameObjects';

export abstract class Behavior {
  abstract update(tank: Tank, input?: KeyboardInput): void;
}
