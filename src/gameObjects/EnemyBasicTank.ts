import { PatrolBehavior } from '../behaviors';
import { TankSkin, TankGrade, TankColor } from '../TankSkin';

import { EnemyTank } from './EnemyTank';

export class EnemyBasicTank extends EnemyTank {
  public behavior = new PatrolBehavior();
  public skin = new TankSkin(TankColor.Gray, TankGrade.E);

  constructor(hasDrop = false) {
    super(52, 60, hasDrop);

    this.skin.hasDrop = true;
    this.skin.rotation = this.rotation;
    this.animation = this.skin.createIdleAnimation();
  }
}
