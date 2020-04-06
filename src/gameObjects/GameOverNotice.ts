import { GameObject, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';

export class GameOverNotice extends GameObject {
  public zIndex = 7;
  public readonly painter = new SpritePainter();

  constructor() {
    super(124, 60);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('ui.gameOver');
  }
}
