import { GameObject, SpriteRenderer } from '../core';
import { GameObjectUpdateArgs } from '../game';

export class EnemyCounterItem extends GameObject {
  public readonly renderer = new SpriteRenderer();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.renderer.sprite = spriteLoader.load('ui.enemy');
  }
}
