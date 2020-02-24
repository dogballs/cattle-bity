import { GameObjectUpdateArgs, GameState } from '../core';
import { Tag } from '../Tag';

import { Tank } from './Tank';

export abstract class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];
  public hasDrop: boolean;

  constructor(width: number, height: number, hasDrop = false) {
    super(width, height);

    this.hasDrop = hasDrop;
    if (hasDrop) {
      this.ignorePause = true;
    }
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    const { gameState } = updateArgs;

    if (gameState.hasChangedTo(GameState.Paused)) {
      this.idle();
    }

    if (gameState.is(GameState.Paused)) {
      this.skinAnimation.update(this);
      this.renderer.sprite = this.skinAnimation.getCurrentFrame();
      return;
    }

    super.update(updateArgs);
  }

  public discardDrop(): this {
    this.hasDrop = false;
    this.ignorePause = false;

    return this;
  }
}
