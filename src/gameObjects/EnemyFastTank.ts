import { Size } from '../core';
import {
  PatrolFireTankBehavior,
  TankAttributesFactory,
  TankSkin,
  TankColor,
  TankGrade,
  TankParty,
} from '../tank';

import { EnemyTank } from './EnemyTank';

export class EnemyFastTank extends EnemyTank {
  constructor(hasDrop = false) {
    const attributes = TankAttributesFactory.create(
      TankParty.Enemy,
      TankGrade.B,
    );
    const behavior = new PatrolFireTankBehavior();
    const skin = new TankSkin(
      TankParty.Enemy,
      TankColor.Default,
      TankGrade.B,
      new Size(52, 60),
    );

    super(64, 64, attributes, behavior, skin, hasDrop);
  }
}
