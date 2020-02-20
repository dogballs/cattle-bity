import { GameObject, RectRenderer } from '../core';
import { Tag } from '../Tag';
import * as config from '../config';

export class BorderWall extends GameObject {
  public renderer = new RectRenderer(config.BACKGROUND_COLOR);
  public tags = [Tag.Wall, Tag.Border, Tag.BlockMove];
}
