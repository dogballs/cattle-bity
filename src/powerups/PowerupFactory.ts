import { RandomUtils } from '../core';
import { Powerup } from '../gameObjects';

import { PowerupType } from './PowerupType';

const TYPES = [
  PowerupType.BaseDefence,
  PowerupType.Life,
  PowerupType.Shield,
  PowerupType.Upgrade,
  PowerupType.Wipeout,
];

export class PowerupFactory {
  public static createRandom(): Powerup {
    const type = this.createRandomType();
    const powerup = this.create(type);
    return powerup;
  }

  public static createRandomType(): PowerupType {
    const type = RandomUtils.arrayElement(TYPES);
    return type;
  }

  public static create(type: PowerupType): Powerup {
    const powerup = new Powerup(type);
    return powerup;
  }
}
