import { GameObject, Sprite, SpriteRenderer } from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';
import { TerrainType } from '../terrain';

export class BrickWall extends GameObject {
  public readonly tags = [Tag.Wall, Tag.Brick, Tag.BlockMove];
  public readonly renderer = new SpriteRenderer();
  private readonly type;
  private sprites: Sprite[];

  constructor(type: TerrainType = TerrainType.Brick) {
    super(16, 16);

    this.type = type;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    let spriteIds = ['wall.brick.1', 'wall.brick.2'];
    if (this.type === TerrainType.MenuBrick) {
      spriteIds = ['menu.brick.1', 'menu.brick.2'];
    }

    this.sprites = spriteLoader.loadList(spriteIds);
    this.renderer.sprite = this.getSpriteByPosition();
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
