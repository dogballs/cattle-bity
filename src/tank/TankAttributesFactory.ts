import { TankGrade } from './TankGrade';
import { TankParty } from './TankParty';

export interface TankAttributes {
  party: TankParty;
  grade: TankGrade;
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
    grade: TankGrade.A,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.B,
    bulletMaxCount: 1,
    bulletSpeed: 15,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.C,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.D,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    bulletTankDamage: 2,
    bulletWallDamage: 2,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Enemy,
    grade: TankGrade.A,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 2,
  },
  {
    party: TankParty.Enemy,
    grade: TankGrade.B,
    bulletMaxCount: 1,
    bulletSpeed: 13,
    bulletTankDamage: 1,
    bulletWallDamage: 1,
    health: 1,
    moveSpeed: 4,
  },
];

export class TankAttributesFactory {
  public static create(party: TankParty, grade: TankGrade): TankAttributes {
    const foundDescription = list.find((description) => {
      return description.party === party && description.grade === grade;
    });

    if (foundDescription === undefined) {
      throw new Error(
        `Tank attributes not found for party = "${party}" and grade = "${grade}"`,
      );
    }

    // TODO: ugly, to prevent changing object by reference
    const attributes = Object.assign({}, foundDescription);

    return attributes;
  }
}
