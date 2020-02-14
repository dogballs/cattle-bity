import { TankGrade } from './TankGrade';
import { TankParty } from './TankParty';

export interface TankAttributes {
  party: TankParty;
  grade: TankGrade;
  bulletDamage: number;
  bulletMaxCount: number;
  bulletSpeed: number;
  health: number;
  moveSpeed: number;
}

// TODO: move to separate config file
const list: TankAttributes[] = [
  {
    party: TankParty.Player,
    grade: TankGrade.A,
    bulletDamage: 1,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.B,
    bulletDamage: 1,
    bulletMaxCount: 1,
    bulletSpeed: 15,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.C,
    bulletDamage: 1,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Player,
    grade: TankGrade.D,
    bulletDamage: 2,
    bulletMaxCount: 2,
    bulletSpeed: 15,
    health: 1,
    moveSpeed: 3,
  },
  {
    party: TankParty.Enemy,
    grade: TankGrade.A,
    bulletDamage: 1,
    bulletMaxCount: 1,
    bulletSpeed: 10,
    health: 1,
    moveSpeed: 2,
  },
  {
    party: TankParty.Enemy,
    grade: TankGrade.B,
    bulletDamage: 1,
    bulletMaxCount: 1,
    bulletSpeed: 13,
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
