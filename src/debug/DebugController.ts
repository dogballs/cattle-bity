import { GameObject } from '../core';
import { PowerupFactory, PowerupType } from '../powerups';

import { Level } from '../level';

export class DebugController {
  protected readonly level: Level;

  constructor(level: Level) {
    this.level = level;
  }

  public activatePowerup(type: PowerupType): void {
    const powerup = PowerupFactory.create(type);
    powerup.action.execute(this.level.playerTank, powerup, this.level.base);
  }

  public playerTankFire(): void {
    this.level.playerTank.fire();
  }

  public findByTag(tags: string | string[]): GameObject[] {
    return this.level.field.getChildrenWithTag(tags);
  }
}
