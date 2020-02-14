import { Dimensions } from '../core';
import { PlayerBehavior } from '../behaviors';
import { Tag } from '../Tag';
import {
  TankSkin,
  TankColor,
  TankGrade,
  TankParty,
  TankAttributesFactory,
} from '../tank';

import { Tank, TankState } from './Tank';

const MAX_GRADE = 4;

export class PlayerTank extends Tank {
  public grade: number;

  constructor() {
    const attributes = TankAttributesFactory.create(
      TankParty.Player,
      TankGrade.A,
    );
    const behavior = new PlayerBehavior();
    const skin = new TankSkin(TankParty.Player, TankColor.Primary, TankGrade.A);

    super(52, 52, attributes, behavior, skin);

    this.tags = [Tag.Tank, Tag.Player];
    this.grade = 1;

    this.animation = this.skin.createIdleAnimation();
  }

  public upgrade(): void {
    if (this.grade >= MAX_GRADE) {
      return;
    }

    this.grade += 1;

    if (this.grade === 1) {
      this.dimensions = new Dimensions(52, 52);
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.A,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.A,
      );
    } else if (this.grade === 2) {
      this.dimensions = new Dimensions(52, 64);
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.B,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.B,
      );
    } else if (this.grade === 3) {
      this.dimensions = new Dimensions(52, 60);
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.C,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.C,
      );
    } else if (this.grade === 4) {
      // TODO: Higher damage
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.D,
      );
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
