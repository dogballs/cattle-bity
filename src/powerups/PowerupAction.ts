import { Base, PlayerTank, Powerup } from '../gameObjects';

export abstract class PowerupAction {
  abstract execute(tank?: PlayerTank, powerup?: Powerup, base?: Base): void;
}
