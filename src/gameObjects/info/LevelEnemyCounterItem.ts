import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';

export class LevelEnemyCounterItem extends GameObject {
  public readonly painter = new SpritePainter();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('ui.enemy');
  }
}
