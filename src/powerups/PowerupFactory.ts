import { RandomUtils } from '../core';
import { Powerup } from '../gameObjects';

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

// TODO: is it ok? Action class is created when file is loaded and single
// instance is used for all powerups of that type
// TODO: move configuration to separate file

const map = new Map<PowerupType, PowerupDescription>();

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

    const powerup = this.create(type);

    return powerup;
  }

  public static create(type: PowerupType): Powerup {
    const description = map.get(type);

    const powerup = new Powerup(
      type,
      description.action,
      description.spriteId,
      description.pickupAudioId,
    );

    return powerup;
  }
}
