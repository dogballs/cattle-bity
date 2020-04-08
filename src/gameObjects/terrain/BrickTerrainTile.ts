import { Collider, Sprite, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class BrickTerrainTile extends TerrainTile {
  public type = TerrainType.Brick;
  public collider = new Collider(false);
  public readonly tags = [Tag.Wall, Tag.Brick, Tag.BlockMove];
  public readonly painter = new SpritePainter();
  protected sprites: Sprite[];

  constructor() {
    super(config.BRICK_TILE_SIZE, config.BRICK_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.sprites = spriteLoader.loadList(this.getSpriteIds());
    this.painter.sprite = this.getSpriteByPosition();
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
