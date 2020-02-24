import { GameObject, GameObjectUpdateArgs, SpriteRenderer } from '../core';

export class EnemyCounterItem extends GameObject {
  public readonly renderer = new SpriteRenderer();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.renderer.sprite = spriteLoader.load('ui.enemy');
  }
}
