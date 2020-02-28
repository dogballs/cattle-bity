import {
  GameObject,
  GameObjectUpdateArgs,
  Rotation,
  SpriteRenderer,
} from '../core';
import {
  TankColor,
  TankParty,
  TankSpriteId,
  TankTier,
  TankType,
} from '../tank';

import { SpriteText } from './SpriteText';

export class ScoreTableTierIcon extends GameObject {
  private tier: TankTier;
  private leftIcon = new SpriteText('←', { scale: 4 });
  private tank = new GameObject(64, 64);

  constructor(tier: TankTier) {
    super(128, 64);

    this.tier = tier;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    const type = new TankType(TankParty.Enemy, TankColor.Default, this.tier);
    const spriteId = TankSpriteId.create(type, Rotation.Up);
    const sprite = spriteLoader.load(spriteId);

    const renderer = new SpriteRenderer();
    renderer.sprite = sprite;
    this.tank.renderer = renderer;
    this.tank.setCenter(this.getChildrenCenter());
    this.add(this.tank);

    this.leftIcon.position.setY(16);
    this.add(this.leftIcon);
  }
}
