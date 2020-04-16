import { SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class IceTerrainTile extends TerrainTile {
  public type = TerrainType.Ice;
  public painter = new SpritePainter();
  public tags = [Tag.Ice];
  public zIndex = config.ICE_TILE_Z_INDEX;

  constructor() {
    super(config.ICE_TILE_SIZE, config.ICE_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.ice');
  }
}
