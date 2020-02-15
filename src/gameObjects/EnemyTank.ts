import { GameObjectUpdateArgs, GameState } from '../core';
import { TankAttributes, TankBehavior, TankSkin } from '../tank';
import { Tag } from '../Tag';

import { Tank } from './Tank';

export abstract class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];
  public hasDrop: boolean;

  constructor(
    width: number,
    height: number,
    attributes: TankAttributes,
    behavior: TankBehavior,
    skin: TankSkin,
    hasDrop = false,
  ) {
    super(width, height, attributes, behavior, skin);

    this.hasDrop = hasDrop;
    if (hasDrop) {
      this.ignorePause = true;
    }
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    const { gameState } = updateArgs;

    if (gameState.hasChangedTo(GameState.Paused)) {
      this.idle();
    }

    if (gameState.is(GameState.Paused)) {
      this.skin.update(this);
      this.renderer.sprite = this.skin.getCurrentFrame();
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
