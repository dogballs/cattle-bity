import { PowerupFactory, PowerupType } from '../powerups';

import { Spawner } from '../Spawner';

export class DebugController {
  private readonly spawner: Spawner;

  constructor(spawner: Spawner) {
    this.spawner = spawner;
  }

  activatePowerup(type: PowerupType): void {
    const powerup = PowerupFactory.create(type);
    powerup.action.execute(this.spawner.playerTank, powerup, this.spawner.base);
  }
}
