import {
  EnemyFastTankAnimationMap,
  EnemyFastDropTankAnimationMap,
} from '../animations';

import { EnemyTank } from './EnemyTank';

export class EnemyFastTank extends EnemyTank {
  protected bulletSpeed = 13;
  protected health = 1;
  protected speed = 4;

  constructor(hasDrop = false) {
    super(52, 60, hasDrop);

    this.animationMap = hasDrop
      ? new EnemyFastDropTankAnimationMap()
      : new EnemyFastTankAnimationMap();
  }
}
