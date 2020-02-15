import { GameObjectUpdateArgs } from '../../core';
import { Tank } from '../../gameObjects';

export abstract class TankBehavior {
  abstract update(tank: Tank, updateArgs?: GameObjectUpdateArgs): void;
}
