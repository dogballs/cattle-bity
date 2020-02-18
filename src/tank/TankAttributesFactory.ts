import { TankTier } from './TankTier';
import { TankParty } from './TankParty';

export interface TankAttributes {
  party: TankParty;
  tier: TankTier;
  bulletMaxCount: number;
  bulletSpeed: number;
  bulletTankDamage: number;
  bulletWallDamage: number;
  health: number;
  moveSpeed: number;
}

// TODO: move to separate config file
const list: TankAttributes[] = [
  {
    party: TankParty.Player,
    tier: TankTier.A,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    tier: TankTier.B,
    bulletMaxCount: 1,
    bulletSpeed: 15,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    tier: TankTier.C,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    tier: TankTier.D,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    bulletTankDamage: 2,
    bulletWallDamage: 2,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Enemy,
    tier: TankTier.A,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 2,
  },
  {
    party: TankParty.Enemy,
    tier: TankTier.B,
    bulletMaxCount: 1,
    bulletSpeed: 13,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 4,
  },
];

export class TankAttributesFactory {
  public static create(party: TankParty, tier: TankTier): TankAttributes {
    const foundDescription = list.find((description) => {
      return description.party === party && description.tier === tier;
    });

    if (foundDescription === undefined) {
      throw new Error(
        `Tank attributes not found for party = "${party}" and tier = "${tier}"`,
      );
    }

    // TODO: ugly, to prevent changing object by reference
    const attributes = Object.assign({}, foundDescription);

    return attributes;
  }
}
