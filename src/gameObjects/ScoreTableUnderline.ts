import { GameObject, RectPainter } from '../core';

export class ScoreTableUnderline extends GameObject {
  public painter = new RectPainter('#fff');

  constructor() {
    super(256, 8);
  }
}
