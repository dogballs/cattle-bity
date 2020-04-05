import { GameUpdateArgs, GameState, Tag } from '../game';
import {
  DumbAiTankBehavior,
  TankAttributesFactory,
  TankSkinAnimation,
  TankType,
} from '../tank';

import { Tank } from './Tank';

export class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];

  constructor(type: TankType) {
    super(64, 64);

    this.type = type;

    if (this.type.hasDrop) {
      this.ignorePause = true;
    }
  }

  protected setup(updateArgs: GameUpdateArgs): void {
    const { spriteLoader } = updateArgs;

    this.attributes = TankAttributesFactory.create(this.type);
    this.behavior = new DumbAiTankBehavior();
    this.skinAnimation = new TankSkinAnimation(
      spriteLoader,
      this.type,
      this.type.hasDrop,
    );

    super.setup(updateArgs);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { deltaTime, gameState } = updateArgs;

    if (gameState.hasChangedTo(GameState.Paused)) {
      this.idle();
    }

    if (gameState.is(GameState.Paused)) {
      this.skinAnimation.update(this, deltaTime);
      this.painter.sprite = this.skinAnimation.getCurrentFrame();
      return;
    }

    super.update(updateArgs);
  }

  public discardDrop(): this {
    this.type.hasDrop = false;
    this.ignorePause = false;

    return this;
  }
}
