import {
  EnemyBasicTankAnimationMap,
  EnemyBasicDropTankAnimationMap,
} from '../animations';

import { EnemyTank } from './EnemyTank';

export class EnemyBasicTank extends EnemyTank {
  constructor(hasDrop = false) {
    super(52, 60, hasDrop);

    this.animationMap = hasDrop
      ? new EnemyBasicDropTankAnimationMap()
      : new EnemyBasicTankAnimationMap();
  }
}
