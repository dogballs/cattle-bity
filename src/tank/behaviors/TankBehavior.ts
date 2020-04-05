import { GameUpdateArgs } from '../../game';
import { Tank } from '../../gameObjects';

export abstract class TankBehavior {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setup(tank: Tank, updateArgs?: GameUpdateArgs): void {
    // Virtual
  }
  public abstract update(tank: Tank, updateArgs?: GameUpdateArgs): void;
}
