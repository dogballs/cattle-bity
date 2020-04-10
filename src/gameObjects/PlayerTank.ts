import { Subject } from '../core';
import { GameUpdateArgs, Tag } from '../game';
import {
  TankSkinAnimation,
  TankColor,
  TankTier,
  TankType,
  TankAttributesFactory,
} from '../tank';

import { Tank } from './Tank';

export class PlayerTank extends Tank {
  public upgraded = new Subject<{ tier: TankTier }>();
  public tags = [Tag.Tank, Tag.Player];
  private tierSkinAnimations = new Map<TankTier, TankSkinAnimation>();
  private colors: TankColor[] = [TankColor.Primary];

  protected setup(updateArgs: GameUpdateArgs): void {
    const { spriteLoader } = updateArgs;

    this.tierSkinAnimations.set(
      TankTier.A,
      new TankSkinAnimation(spriteLoader, TankType.PlayerA(), this.colors),
    );
    this.tierSkinAnimations.set(
      TankTier.B,
      new TankSkinAnimation(spriteLoader, TankType.PlayerB(), this.colors),
    );
    this.tierSkinAnimations.set(
      TankTier.C,
      new TankSkinAnimation(spriteLoader, TankType.PlayerC(), this.colors),
    );
    this.tierSkinAnimations.set(
      TankTier.D,
      new TankSkinAnimation(spriteLoader, TankType.PlayerD(), this.colors),
    );

    this.skinAnimation = this.tierSkinAnimations.get(this.type.tier);

    super.setup(updateArgs);
  }

  // If tier is provided - it means that specific tier needs to be activated
  // when transitioning to the next level.next
  // If not - then most likely powerup has been picked up and we simply need
  // to upgrade the tank one tier up.
  public upgrade(targetTier: TankTier = null, notify = true): void {
    if (this.type.isMaxTier()) {
      return;
    }

    this.type.increaseTier(targetTier);

    this.attributes = TankAttributesFactory.create(this.type);
    this.skinAnimation = this.tierSkinAnimations.get(this.type.tier);

    if (notify === true) {
      this.upgraded.notify({ tier: this.type.tier });
    }
  }
}
