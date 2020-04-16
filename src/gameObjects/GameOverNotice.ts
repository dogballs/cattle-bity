import { GameObject, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

export class GameOverNotice extends GameObject {
  public zIndex = config.GAME_OVER_NOTICE_Z_INDEX;
  public readonly painter = new SpritePainter();

  constructor() {
    super(124, 60);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('ui.gameOver');
  }
}
