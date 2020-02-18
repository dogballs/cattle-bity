import { GameObject, RectRenderer } from '../core';
import { Tag } from '../Tag';

export class BorderWall extends GameObject {
  public renderer = new RectRenderer('#636363');
  public tags = [Tag.Wall, Tag.Border, Tag.BlockMove];
}
