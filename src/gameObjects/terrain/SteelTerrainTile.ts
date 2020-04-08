import { Collider, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class SteelTerrainTile extends TerrainTile {
  public type = TerrainType.Steel;
  public collider = new Collider(false);
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.STEEL_TILE_SIZE, config.STEEL_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.steel');
  }
}
