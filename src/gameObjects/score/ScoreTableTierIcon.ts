import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs, Rotation } from '../../game';
import {
  TankColor,
  TankParty,
  TankSpriteId,
  TankTier,
  TankType,
} from '../../tank';
import * as config from '../../config';

import { SpriteText } from '../text';

export class ScoreTableTierIcon extends GameObject {
  private tier: TankTier;
  private showRight: boolean;
  private leftIcon = new SpriteText('←', {
    color: config.COLOR_WHITE,
  });
  private rightIcon = new SpriteText('→', {
    color: config.COLOR_WHITE,
  });
  private tank = new GameObject(64, 64);

  constructor(tier: TankTier, showRight = false) {
    super(128, 64);

    this.tier = tier;
    this.showRight = showRight;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const type = new TankType(TankParty.Enemy, this.tier);
    const spriteId = TankSpriteId.create(type, TankColor.Default, Rotation.Up);
    const sprite = spriteLoader.load(spriteId);

    const painter = new SpritePainter();
    painter.sprite = sprite;
    this.tank.painter = painter;
    this.tank.updateMatrix();
    this.tank.setCenter(this.getSelfCenter());
    this.add(this.tank);

    this.leftIcon.position.setY(16);
    this.add(this.leftIcon);

    if (this.showRight) {
      this.rightIcon.position.set(100, 16);
      this.add(this.rightIcon);
    }
  }
}
