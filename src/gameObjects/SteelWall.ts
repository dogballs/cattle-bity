import { Tag } from '../Tag';

import { GameObject, Sprite, SpriteRenderer } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';

export class SteelWall extends GameObject {
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  private readonly sprites: Sprite[];

  constructor() {
    super(32, 32);

    this.renderer = new SpriteRenderer(SpriteFactory.asOne('wall.steel'));
  }
}
