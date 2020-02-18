import { Size } from '../core';
import {
  PlayerTankBehavior,
  TankSkin,
  TankColor,
  TankTier,
  TankParty,
  TankAttributesFactory,
} from '../tank';
import { Tag } from '../Tag';

import { Tank } from './Tank';

const MAX_TIER = 4;

export class PlayerTank extends Tank {
  public tier: number;

  constructor() {
    const attributes = TankAttributesFactory.create(
      TankParty.Player,
      TankTier.A,
    );
    const behavior = new PlayerTankBehavior();
    const skin = new TankSkin(
      TankParty.Player,
      TankColor.Primary,
      TankTier.A,
      new Size(52, 52),
    );

    super(64, 64, attributes, behavior, skin);

    this.tags = [Tag.Tank, Tag.Player];
    this.tier = 1;
  }

  public upgrade(): void {
    if (this.tier >= MAX_TIER) {
      return;
    }

    this.tier += 1;

    if (this.tier === 1) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankTier.A,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankTier.A,
        new Size(52, 52),
      );
    } else if (this.tier === 2) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankTier.B,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankTier.B,
        new Size(52, 64),
      );
    } else if (this.tier === 3) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankTier.C,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankTier.C,
        new Size(52, 60),
      );
    } else if (this.tier === 4) {
      this.attributes = TankAttributesFactory.create(
        TankParty.Player,
        TankTier.D,
      );
      this.skin = new TankSkin(
        TankParty.Player,
        TankColor.Primary,
        TankTier.D,
        new Size(52, 60),
      );
    }
  }
}
