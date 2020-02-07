import { GameObjectUpdateArgs } from '../core';
import { Tank } from '../gameObjects';

export abstract class Behavior {
  abstract update(tank: Tank, updateArgs?: GameObjectUpdateArgs): void;
}
