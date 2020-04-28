import { TankBulletWallDamage } from './TankBulletWallDamage';
import { TankParty } from './TankParty';
import { TankTier } from './TankTier';
import { TankType } from './TankType';

export interface TankAttributes {
  bulletMaxCount: number;
  bulletRapidFireDelay: number;
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

enum BulletRapidFireDelay {
  Slow = 0.16,
  Fast = 0.04,
}

enum BulletSpeed {
  Slow = 600,
  Fast = 900,
}

enum MoveSpeed {
  Slow = 120,
  Medium = 180,
  Fast = 240,
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
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Slow,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Medium,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.B,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Fast,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Medium,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.C,
      },
      attributes: {
        bulletMaxCount: 2,
        bulletRapidFireDelay: BulletRapidFireDelay.Fast,
        bulletSpeed: BulletSpeed.Fast,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Medium,
      },
    },
    {
      selector: {
        party: TankParty.Player,
        tier: TankTier.D,
      },
      attributes: {
        bulletMaxCount: 2,
        bulletRapidFireDelay: BulletRapidFireDelay.Fast,
        bulletSpeed: BulletSpeed.Fast,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.High,
        health: 1,
        moveSpeed: MoveSpeed.Medium,
      },
    },

    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.A,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Slow,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Slow,
      },
    },
    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.B,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Slow,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Fast,
      },
    },
    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.C,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Fast,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 1,
        moveSpeed: MoveSpeed.Slow,
      },
    },
    {
      selector: {
        party: TankParty.Enemy,
        tier: TankTier.D,
      },
      attributes: {
        bulletMaxCount: 1,
        bulletRapidFireDelay: BulletRapidFireDelay.Slow,
        bulletSpeed: BulletSpeed.Slow,
        bulletTankDamage: 1,
        bulletWallDamage: TankBulletWallDamage.Low,
        health: 4,
        moveSpeed: MoveSpeed.Slow,
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
