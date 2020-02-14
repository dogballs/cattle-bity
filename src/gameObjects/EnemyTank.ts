import { GameObjectUpdateArgs, GameState } from '../core';
import { Behavior } from '../behaviors';
import { TankAttributes, TankSkin } from '../tank';
import { Tag } from '../Tag';

import { Tank } from './Tank';

export abstract class EnemyTank extends Tank {
  public tags = [Tag.Tank, Tag.Enemy];
  public hasDrop: boolean;

  constructor(
    width: number,
    height: number,
    attributes: TankAttributes,
    behavior: Behavior,
    skin: TankSkin,
    hasDrop = false,
  ) {
    super(width, height, attributes, behavior, skin);

    this.hasDrop = hasDrop;
    if (hasDrop) {
      this.ignorePause = true;
    }

    this.skin.hasDrop = hasDrop;
    this.skin.rotation = this.rotation;
    this.animation = this.skin.createIdleAnimation();
  }

  public update(updateArgs: GameObjectUpdateArgs): void {
    const { gameState } = updateArgs;

    if (gameState.hasChangedTo(GameState.Paused)) {
      this.idle();
    }

    if (gameState.is(GameState.Paused)) {
      this.animation.animate();
      this.material.sprite = this.animation.getCurrentFrame();
      return;
    }

    super.update(updateArgs);
  }

  public discardDrop(): this {
    this.hasDrop = false;

    return this;
  }
}
