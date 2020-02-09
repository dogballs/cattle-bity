import { Behavior, PlayerBehavior } from '../behaviors';
import { Tag } from '../Tag';
import { TankSkin, TankGrade, TankColor } from '../TankSkin';

import { Shield } from './Shield';
import { Tank } from './Tank';

export class PlayerTank extends Tank {
  public behavior: Behavior = new PlayerBehavior();
  public tags = [Tag.Tank, Tag.Player];
  public skin = new TankSkin(TankColor.Yellow, TankGrade.A);
  protected speed = 3;

  constructor() {
    super(52, 52);

    this.shield = new Shield();
    this.shield.setCenterFrom(this);
    // this.add(this.shield);

    this.animation = this.skin.createIdleAnimation();
  }
}
