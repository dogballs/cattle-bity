import { Collider, GameObject, Sprite, SpritePainter } from '../core';
import { GameObjectUpdateArgs, Tag } from '../game';

export class BrickWall extends GameObject {
  public collider = new Collider(false);
  public readonly tags = [Tag.Wall, Tag.Brick, Tag.BlockMove];
  public readonly painter = new SpritePainter();
  protected sprites: Sprite[];

  constructor() {
    super(16, 16);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.sprites = spriteLoader.loadList(this.getSpriteIds());
    this.painter.sprite = this.getSpriteByPosition();
  }

  protected getSpriteIds(): string[] {
    return ['wall.brick.1', 'wall.brick.2'];
  }

  protected getSpriteByPosition(): Sprite {
    const horizontalIndex = Math.floor(this.position.x / 16) % 2;
    const verticalIndex = Math.floor(this.position.y / 16) % 2;
    const index = (horizontalIndex + verticalIndex) % 2;

    const sprite = this.sprites[index];

    return sprite;
  }
}
