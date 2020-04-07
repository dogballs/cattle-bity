import { GameObject, SpritePainter } from '../core';
import { GameUpdateArgs, Rotation } from '../game';
import {
  TankSpriteId,
  TankType,
  TankParty,
  TankColor,
  TankTier,
} from '../tank';

export class TestTank extends GameObject {
  private bottom: GameObject;
  private top: GameObject;
  private topColor: TankColor;
  private bottomColor: TankColor;

  constructor(topColor: TankColor, bottomColor: TankColor) {
    super(64, 64);

    this.topColor = topColor;
    this.bottomColor = bottomColor;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    const bottomType = new TankType(TankParty.Enemy, TankTier.D);
    const bottomSpriteId = TankSpriteId.create(
      bottomType,
      this.bottomColor,
      Rotation.Up,
    );
    const bottomSprite = spriteLoader.load(bottomSpriteId);

    const bottom = new GameObject(64, 64);
    bottom.painter = new SpritePainter(bottomSprite);
    this.add(bottom);

    const topType = new TankType(TankParty.Enemy, TankTier.D);
    const topSpriteId = TankSpriteId.create(
      topType,
      this.topColor,
      Rotation.Up,
    );
    const topSprite = spriteLoader.load(topSpriteId);

    const top = new GameObject(64, 64);
    const topPainter = new SpritePainter(topSprite);
    topPainter.opacity = 0.5;
    top.painter = topPainter;
    this.add(top);
  }
}
