import { GameObject, GameObjectUpdateArgs, SpriteRenderer } from '../core';
import { Tag } from '../Tag';

export class SteelWall extends GameObject {
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  public readonly renderer = new SpriteRenderer();

  constructor() {
    super(32, 32);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.renderer.sprite = spriteLoader.load('wall.steel');
  }
}
