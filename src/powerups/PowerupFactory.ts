import { Powerup } from '../gameObjects';
import { RandomUtils } from '../utils';

import { PowerupAction } from './PowerupAction';
import { PowerupType } from './PowerupType';
import {
  BaseDefencePowerupAction,
  ShieldPowerupAction,
  UpgradePowerupAction,
  WipeoutPowerupAction,
} from './actions';

interface PowerupDescription {
  action: PowerupAction;
  spriteId: string;
  pickupAudioId: string;
}

const map = new Map<PowerupType, PowerupDescription>();

// TODO: is it ok? Action class is created when file is loaded and single
// instance is used for all powerups of that type
// TODO: move configuration to separate file

map.set(PowerupType.BaseDefence, {
  action: new BaseDefencePowerupAction(),
  spriteId: 'powerup.shovel',
  pickupAudioId: 'powerup.pickup',
});

map.set(PowerupType.Shield, {
  action: new ShieldPowerupAction(),
  spriteId: 'powerup.helmet',
  pickupAudioId: 'powerup.pickup',
});

map.set(PowerupType.Upgrade, {
  action: new UpgradePowerupAction(),
  spriteId: 'powerup.star',
  pickupAudioId: 'powerup.pickup',
});

map.set(PowerupType.Wipeout, {
  action: new WipeoutPowerupAction(),
  spriteId: 'powerup.grenade',
  pickupAudioId: 'powerup.pickup',
});

export class PowerupFactory {
  public static createRandom(): Powerup {
    const types = Array.from(map.keys());

    const type = RandomUtils.arrayElement(types);

    const description = map.get(type);

    const powerup = new Powerup(
      description.action,
      description.spriteId,
      description.pickupAudioId,
    );

    return powerup;
  }
}
