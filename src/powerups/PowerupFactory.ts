import { Powerup } from '../gameObjects';
import { RandomUtils } from '../utils';

import { PowerupAction } from './PowerupAction';
import { PowerupType } from './PowerupType';
import {
  ShieldPowerupAction,
  UpgradePowerupAction,
  WipeoutPowerupAction,
} from './actions';

interface PowerupDescription {
  spriteId: string;
  action: PowerupAction;
}

const map = new Map<PowerupType, PowerupDescription>();

// TODO: is it ok? Action class is created when file is loaded and single
// instance is used for all powerups of that type

map.set(PowerupType.Shield, {
  spriteId: 'powerup.helmet',
  action: new ShieldPowerupAction(),
});

map.set(PowerupType.Upgrade, {
  spriteId: 'powerup.star',
  action: new UpgradePowerupAction(),
});

map.set(PowerupType.Wipeout, {
  spriteId: 'powerup.grenade',
  action: new WipeoutPowerupAction(),
});

export class PowerupFactory {
  public static createRandom(): Powerup {
    const types = Array.from(map.keys());

    const type = RandomUtils.arrayElement(types);

    const description = map.get(type);

    const powerup = new Powerup(description.spriteId, description.action);

    return powerup;
  }
}
