import { BoxCollider, Sprite, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

// Movement collision tags are defined in BrickSuperTerrainTile.
// Bullet collsion tags are defined here.

export class BrickTerrainTile extends TerrainTile {
  public type = TerrainType.Brick;
  public collider = new BoxCollider(this);
  public readonly tags = [Tag.Wall, Tag.Brick];
  public readonly painter = new SpritePainter();
  protected sprites: Sprite[];

  constructor() {
    super(config.BRICK_TILE_SIZE, config.BRICK_TILE_SIZE);
  }

  public destroy(): void {
    super.destroy();
    this.collider.unregister();
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    this.sprites = spriteLoader.loadList(this.getSpriteIds());
    this.painter.sprite = this.getSpriteByPosition();
  }

  protected update(): void {
    this.collider.update();
  }

  protected getSpriteIds(): string[] {
    return ['terrain.brick.1', 'terrain.brick.2'];
  }

  protected getSpriteByPosition(): Sprite {
    const horizontalIndex =
      Math.floor(this.position.x / config.BRICK_TILE_SIZE) % 2;
    const verticalIndex =
      Math.floor(this.position.y / config.BRICK_TILE_SIZE) % 2;
    const index = (horizontalIndex + verticalIndex) % 2;

    const sprite = this.sprites[index];

    return sprite;
  }
}
