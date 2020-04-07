import { TankParty } from './TankParty';
import { TankTier } from './TankTier';
import { TankType } from './TankType';

export interface TankAttributes {
  bulletMaxCount: number;
  bulletSpeed: number;
  bulletTankDamage: number;
  bulletWallDamage: number;
  health: number;
  moveSpeed: number;
}

export interface TankAttributesListSelector {
  party: TankParty;
  tier: TankTier;
}

interface TankAttributesListItem {
  selector: TankAttributesListSelector;
  attributes: TankAttributes;
}

interface TankAttributesConfig {
  list: TankAttributesListItem[];
}

// TODO: move configuration to json
const config: TankAttributesConfig = {
  list: [
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.A,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletSpeed: 600,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 1,
        moveSpeed: 180,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.B,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletSpeed: 900,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 1,
        moveSpeed: 180,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.C,
      },
      attributes: {
        bulletMaxCount: 2,
        bulletSpeed: 900,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 1,
        moveSpeed: 180,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.D,
      },
      attributes: {
        bulletMaxCount: 2,
        bulletSpeed: 900,
        bulletTankDamage: 2,
        bulletWallDamage: 2,
        health: 1,
        moveSpeed: 180,
      },
    },

    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.A,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletSpeed: 600,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 1,
        moveSpeed: 120,
      },
    },
    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.B,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletSpeed: 600,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 1,
        moveSpeed: 240,
      },
    },

    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.D,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletSpeed: 600,
        bulletTankDamage: 1,
        bulletWallDamage: 1,
        health: 4,
        moveSpeed: 180,
      },
    },
  ],
};

export class TankAttributesFactory {
  public static create(type: TankType): TankAttributes {
    const foundItem = config.list.find((item) => {
      const { selector } = item;
      return selector.party === type.party && selector.tier === type.tier;
    });

    if (foundItem === undefined) {
      throw new Error(
        `Tank attributes not found for type = "${type.serialize()}"`,
      );
    }

    // TODO: ugly, to prevent changing object by reference
    const attributes = Object.assign({}, foundItem.attributes);

    return attributes;
  }
}
