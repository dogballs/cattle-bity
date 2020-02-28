import { GameObject, RectRenderer } from '../core';

export class ScoreTableUnderline extends GameObject {
  public renderer = new RectRenderer('#fff');

  constructor() {
    super(256, 8);
  }
}
