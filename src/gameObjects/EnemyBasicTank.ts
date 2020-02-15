import { Size } from '../core';
import {
  PatrolTankBehavior,
  TankAttributesFactory,
  TankSkin,
  TankColor,
  TankGrade,
  TankParty,
} from '../tank';

import { EnemyTank } from './EnemyTank';

export class EnemyBasicTank extends EnemyTank {
  constructor(hasDrop = false) {
    const attributes = TankAttributesFactory.create(
      TankParty.Enemy,
      TankGrade.A,
    );
    const behavior = new PatrolTankBehavior();
    const skin = new TankSkin(
      TankParty.Enemy,
      TankColor.Default,
      TankGrade.A,
      new Size(52, 60),
      hasDrop,
    );

    super(64, 64, attributes, behavior, skin, hasDrop);
  }
}
