import {
  GameObject,
  GameObjectUpdateArgs,
  Sprite,
  SpriteRenderer,
} from '../core';
import { Tag } from '../Tag';

export class BrickWall extends GameObject {
  public readonly tags = [Tag.Wall, Tag.Brick, Tag.BlockMove];
  public readonly renderer = new SpriteRenderer();
  private isMenu = false;
  private sprites: Sprite[];

  constructor(isMenu = false) {
    super(16, 16);

    this.isMenu = isMenu;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    let spriteIds = ['wall.brick.1', 'wall.brick.2'];
    if (this.isMenu) {
      spriteIds = ['menu.brick.1', 'menu.brick.2'];
    }

    this.sprites = spriteLoader.loadList(spriteIds);
  }

  protected update(): void {
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
