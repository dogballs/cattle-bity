import { PatrolFireBehavior } from '../behaviors';
import {
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
    const behavior = new PatrolFireBehavior();
    const skin = new TankSkin(TankParty.Enemy, TankColor.Default, TankGrade.A);

    super(52, 60, attributes, behavior, skin, hasDrop);
  }
}
