import { Tag } from '../Tag';

import { GameObject, Sprite, SpriteMaterial } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';

export class SteelWall extends GameObject {
  public tags = [Tag.Wall];
  private readonly sprites: Sprite[];

  constructor() {
    super(32, 32);

    this.material = new SpriteMaterial(SpriteFactory.asOne('wall.steel'));
  }
}
