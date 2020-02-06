import { PlayerPrimaryTankAnimationMap } from '../animations';
import { Behavior, PlayerBehavior } from '../behaviors';
import { Tag } from '../Tag';

import { Shield } from './Shield';
import { Tank } from './Tank';

export class PlayerTank extends Tank {
  public animationMap = new PlayerPrimaryTankAnimationMap();
  public behavior: Behavior = new PlayerBehavior();
  public tags = [Tag.Tank, Tag.Player];
  protected speed = 3;

  constructor() {
    super(52, 52);

    this.shield = new Shield();
    this.shield.setCenterFrom(this);
    this.add(this.shield);
  }
}
