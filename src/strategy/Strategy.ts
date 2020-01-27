import { KeyboardInput } from '../core';
import { Tank } from '../gameObjects';

export abstract class Strategy {
  abstract update(tank: Tank, input?: KeyboardInput): void;
}
