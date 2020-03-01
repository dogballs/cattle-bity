import { GameObjectUpdateArgs, Tag } from '../game';
import {
  PlayerTankBehavior,
  TankSkinAnimation,
  TankTier,
  TankType,
  TankAttributesFactory,
} from '../tank';

import { Tank } from './Tank';

export class PlayerTank extends Tank {
  public readonly tags = [Tag.Tank, Tag.Player];
  public readonly type = TankType.PlayerPrimaryA;
  private tierSkinAnimations = new Map<TankTier, TankSkinAnimation>();

  constructor() {
    super(64, 64);
  }

  protected setup(updateArgs: GameObjectUpdateArgs): void {
    const { spriteLoader } = updateArgs;

    this.attributes = TankAttributesFactory.create(this.type);
    this.behavior = new PlayerTankBehavior();

    this.tierSkinAnimations.set(
      TankTier.A,
      new TankSkinAnimation(spriteLoader, TankType.PlayerPrimaryA),
    );
    this.tierSkinAnimations.set(
      TankTier.B,
      new TankSkinAnimation(spriteLoader, TankType.PlayerPrimaryB),
    );
    this.tierSkinAnimations.set(
      TankTier.C,
      new TankSkinAnimation(spriteLoader, TankType.PlayerPrimaryC),
    );
    this.tierSkinAnimations.set(
      TankTier.D,
      new TankSkinAnimation(spriteLoader, TankType.PlayerPrimaryD),
    );

    this.skinAnimation = this.tierSkinAnimations.get(this.type.tier);

    super.setup(updateArgs);
  }

  public upgrade(): void {
    if (this.type.isMaxTier()) {
      return;
    }

    this.type.increaseTier();

    this.attributes = TankAttributesFactory.create(this.type);
    this.skinAnimation = this.tierSkinAnimations.get(this.type.tier);
  }
}
