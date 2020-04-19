import { Sprite, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class MenuBrickTerrainTile extends TerrainTile {
  public type = TerrainType.MenuBrick;
  public readonly painter = new SpritePainter();
  protected sprites: Sprite[];

  constructor() {
    super(config.BRICK_TILE_SIZE, config.BRICK_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.sprites = spriteLoader.loadList([
      'terrain.menu-brick.1',
      'terrain.menu-brick.2',
    ]);
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
