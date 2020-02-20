import { Rect } from '../core';
import {
  DumbAiTankBehavior,
  TankAttributesFactory,
  TankSkin,
  TankColor,
  TankTier,
  TankParty,
} from '../tank';

import { EnemyTank } from './EnemyTank';

export class EnemyFastTank extends EnemyTank {
  constructor(hasDrop = false) {
    const attributes = TankAttributesFactory.create(
      TankParty.Enemy,
      TankTier.B,
    );
    const behavior = new DumbAiTankBehavior();
    const skin = new TankSkin(
      TankParty.Enemy,
      TankColor.Default,
      TankTier.B,
      new Rect(0, 0, 52, 60),
    );

    super(64, 64, attributes, behavior, skin, hasDrop);
  }
}
