import { Collider, GameObject, RectPainter } from '../core';
import { Tag } from '../game';
import * as config from '../config';

export class BorderWall extends GameObject {
  public collider = new Collider(false);
  public painter = new RectPainter(config.COLOR_GRAY);
  public tags = [Tag.Wall, Tag.Border, Tag.BlockMove];
}
