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

export class EnemyBasicTank extends EnemyTank {
  constructor(hasDrop = false) {
    const attributes = TankAttributesFactory.create(
      TankParty.Enemy,
      TankTier.A,
    );
    const behavior = new DumbAiTankBehavior();
    const skin = new TankSkin(
      TankParty.Enemy,
      TankColor.Default,
      TankTier.A,
      new Rect(0, 0, 52, 60),
      hasDrop,
    );

    super(64, 64, attributes, behavior, skin, hasDrop);
  }
}
