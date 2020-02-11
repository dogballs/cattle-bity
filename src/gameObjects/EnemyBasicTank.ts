import { PatrolBehavior } from '../behaviors';
import { TankSkin, TankColor, TankGrade, TankParty } from '../TankSkin';

import { EnemyTank } from './EnemyTank';

export class EnemyBasicTank extends EnemyTank {
  public behavior = new PatrolBehavior();
  public skin = new TankSkin(TankParty.Enemy, TankColor.Default, TankGrade.A);

  constructor(hasDrop = false) {
    super(52, 60, hasDrop);

    this.skin.hasDrop = hasDrop;
    this.skin.rotation = this.rotation;
    this.animation = this.skin.createIdleAnimation();
  }
}
