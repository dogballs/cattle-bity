import { GameObject } from '../core';
import { PowerupFactory, PowerupType } from '../powerups';

import { Spawner } from '../Spawner';

export class DebugController {
  protected readonly spawner: Spawner;

  constructor(spawner: Spawner) {
    this.spawner = spawner;
  }

  public activatePowerup(type: PowerupType): void {
    const powerup = PowerupFactory.create(type);
    powerup.action.execute(this.spawner.playerTank, powerup, this.spawner.base);
  }

  public playerTankFire(): void {
    this.spawner.playerTank.fire();
  }

  public findByTag(tags: string | string[]): GameObject[] {
    return this.spawner.field.getChildrenWithTag(tags);
  }
}
