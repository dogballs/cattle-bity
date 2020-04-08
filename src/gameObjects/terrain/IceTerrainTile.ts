import { SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class IceTerrainTile extends TerrainTile {
  public type = TerrainType.Ice;
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.ICE_TILE_SIZE, config.ICE_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.ice');
  }
}
