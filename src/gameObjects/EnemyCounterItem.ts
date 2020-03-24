import { GameObject, SpritePainter } from '../core';
import { GameObjectUpdateArgs } from '../game';

export class EnemyCounterItem extends GameObject {
  public readonly painter = new SpritePainter();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('ui.enemy');
  }
}
