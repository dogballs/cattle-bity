import { GameObjectUpdateArgs } from '../game';
import {
  DumbAiTankBehavior,
  TankAttributesFactory,
  TankSkinAnimation,
  TankType,
} from '../tank';

import { EnemyTank } from './EnemyTank';

export class EnemyFastTank extends EnemyTank {
  public readonly type = TankType.EnemyDefaultB;

  constructor(hasDrop = false) {
    super(64, 64, hasDrop);
  }

  protected setup(updateArgs: GameObjectUpdateArgs): void {
    const { spriteLoader } = updateArgs;

    this.attributes = TankAttributesFactory.create(this.type);
    this.behavior = new DumbAiTankBehavior();
    this.skinAnimation = new TankSkinAnimation(
      spriteLoader,
      this.type,
      this.hasDrop,
    );

    super.setup(updateArgs);
  }
}
