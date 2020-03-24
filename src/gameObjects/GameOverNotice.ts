import { GameObject, SpritePainter } from '../core';
import { GameObjectUpdateArgs } from '../game';

export class GameOverNotice extends GameObject {
  public readonly painter = new SpritePainter();

  constructor() {
    super(124, 60);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('ui.gameOver');
  }
}
