import { Size } from '../core';
import {
  PlayerTankBehavior,
  TankSkin,
  TankColor,
  TankGrade,
  TankParty,
  TankAttributesFactory,
} from '../tank';
import { Tag } from '../Tag';

import { Tank } from './Tank';

const MAX_GRADE = 4;

export class PlayerTank extends Tank {
  public grade: number;

  constructor() {
    const attributes = TankAttributesFactory.create(
      TankParty.Player,
      TankGrade.A,
    );
    const behavior = new PlayerTankBehavior();
    const skin = new TankSkin(
      TankParty.Player,
      TankColor.Primary,
      TankGrade.A,
      new Size(52, 52),
    );

    super(64, 64, attributes, behavior, skin);

    this.tags = [Tag.Tank, Tag.Player];
    this.grade = 1;
  }

  public upgrade(): void {
    if (this.grade >= MAX_GRADE) {
      return;
    }

    this.grade += 1;

    if (this.grade === 1) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.A,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.A,
        new Size(52, 52),
      );
    } else if (this.grade === 2) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.B,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.B,
        new Size(52, 64),
      );
    } else if (this.grade === 3) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.C,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.C,
        new Size(52, 60),
      );
    } else if (this.grade === 4) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankGrade.D,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankGrade.D,
        new Size(52, 60),
      );
    }
  }
}
