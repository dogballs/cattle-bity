import { PatrolFireBehavior } from '../behaviors';
import {
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
    const behavior = new PatrolFireBehavior();
    const skin = new TankSkin(TankParty.Enemy, TankColor.Default, TankGrade.B);

    super(52, 60, attributes, behavior, skin, hasDrop);
  }
}
