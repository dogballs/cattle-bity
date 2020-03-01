import { GameObject, RectRenderer } from '../core';
import { Tag } from '../game';
import * as config from '../config';

export class BorderWall extends GameObject {
  public readonly renderer = new RectRenderer(config.COLOR_GRAY);
  public readonly tags = [Tag.Wall, Tag.Border, Tag.BlockMove];
}
