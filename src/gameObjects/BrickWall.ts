import { GameObject, Sprite, SpriteRenderer } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';
import { Tag } from '../Tag';

export class BrickWall extends GameObject {
  public readonly tags = [Tag.Wall, Tag.Brick, Tag.BlockMove];
  public readonly renderer = new SpriteRenderer();
  private readonly sprites: Sprite[];

  constructor(isMenu = false) {
    super(16, 16);

    let spriteIds = ['wall.brick.1', 'wall.brick.2'];
    if (isMenu) {
      spriteIds = ['menu.brick.1', 'menu.brick.2'];
    }

    this.sprites = SpriteFactory.asList(spriteIds);
  }

  public update(): void {
    this.renderer.sprite = this.getSpriteByPosition();
  }

  protected onAdded(): void {
    this.renderer.sprite = this.getSpriteByPosition();
  }

  private getSpriteByPosition(): Sprite {
    const horizontalIndex = Math.floor(this.position.x / 16) % 2;
    const verticalIndex = Math.floor(this.position.y / 16) % 2;
    const index = (horizontalIndex + verticalIndex) % 2;

    const sprite = this.sprites[index];

    return sprite;
  }
}
