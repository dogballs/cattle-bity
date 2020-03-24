import { GameObject, RectPainter } from '../core';
import { Tag } from '../game';
import * as config from '../config';

export class BorderWall extends GameObject {
  public readonly renderer = new RectPainter(config.COLOR_GRAY);
  public readonly tags = [Tag.Wall, Tag.Border, Tag.BlockMove];
}
