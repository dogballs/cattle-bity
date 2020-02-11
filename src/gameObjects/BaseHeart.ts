import { GameObject, SpriteMaterial } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';

export class BaseHeart extends GameObject {
  public material = new SpriteMaterial();
  // Tank can't move on top of it
  public tags = [Tag.Wall];

  constructor() {
    super(64, 64);

    this.material.sprite = SpriteFactory.asOne('base.heart.alive');
  }

  public die(): void {
    this.material.sprite = SpriteFactory.asOne('base.heart.dead');
  }
}
