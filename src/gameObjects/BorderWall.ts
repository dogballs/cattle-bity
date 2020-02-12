import { BasicMaterial, GameObject } from '../core';
import { Tag } from '../Tag';

export class BorderWall extends GameObject {
  public material = new BasicMaterial('#7e7e7e');
  public tags = [Tag.Wall, Tag.BlockMove];
}
