import { GameUpdateArgs, Tag } from '../game';
import {
  PlayerTankBehavior,
  TankSkinAnimation,
  TankColor,
  TankTier,
  TankType,
  TankAttributesFactory,
} from '../tank';

import { Tank } from './Tank';

export class PlayerTank extends Tank {
  public tags = [Tag.Tank, Tag.Player];
  private tierSkinAnimations = new Map<TankTier, TankSkinAnimation>();
  private colors: TankColor[] = [TankColor.Primary];

  constructor() {
    super(TankType.PlayerA());
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { spriteLoader } = updateArgs;

    this.behavior = new PlayerTankBehavior();

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

  public upgrade(): void {
    if (this.type.isMaxTier()) {
      return;
    }

    this.type.increaseTier();

    this.attributes = TankAttributesFactory.create(this.type);
    this.skinAnimation = this.tierSkinAnimations.get(this.type.tier);
  }
}
