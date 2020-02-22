import { Rect } from '../core';
import {
  DumbAiTankBehavior,
  TankAttributesFactory,
  TankSkinAnimation,
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
    const skin = new TankSkinAnimation(
      TankParty.Enemy,
      TankColor.Default,
      TankTier.B,
      new Rect(0, 0, 52, 60),
    );

    super(64, 64, attributes, behavior, skin, hasDrop);
  }
}
