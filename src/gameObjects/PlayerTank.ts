import { Dimensions } from '../core';
import { Behavior, PlayerBehavior } from '../behaviors';
import { Tag } from '../Tag';
import { TankSkin, TankColor, TankGrade, TankParty } from '../TankSkin';

import { Tank, TankState } from './Tank';

const MAX_GRADE = 4;

export class PlayerTank extends Tank {
  public behavior: Behavior = new PlayerBehavior();
  public tags = [Tag.Tank, Tag.Player];
  public skin = new TankSkin(TankParty.Player, TankColor.Primary, TankGrade.A);
  public grade = 1;
  protected speed = 3;

  constructor() {
    super(52, 52);

    this.animation = this.skin.createIdleAnimation();
  }

  public upgrade(): void {
    if (this.grade >= MAX_GRADE) {
      return;
    }

    this.grade += 1;

    if (this.grade === 1) {
      this.dimensions = new Dimensions(52, 52);
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.A,
      );
    } else if (this.grade === 2) {
      // TODO: Faster bullet
      this.dimensions = new Dimensions(52, 64);
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.B,
      );
    } else if (this.grade === 3) {
      // TODO: Faster bullet, 2 at a time
      this.dimensions = new Dimensions(52, 60);
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.C,
      );
    } else if (this.grade === 4) {
      // TODO: Faster bullet, 2 at a time, higher damage
      this.dimensions = new Dimensions(52, 60);
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.D,
      );
    }

    this.skin.rotation = this.rotation;
    if (this.state === TankState.Moving) {
      this.animation = this.skin.createMoveAnimation();
    } else {
      this.animation = this.skin.createIdleAnimation();
    }
  }
}
