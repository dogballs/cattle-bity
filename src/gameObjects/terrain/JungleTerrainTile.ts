import { GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs } from '../../game';
import * as config from '../../config';

export class JungleTerrainTile extends GameObject {
  public readonly painter = new SpritePainter();
  public zIndex = 4;

  constructor() {
    super(config.JUNGLE_TILE_SIZE, config.JUNGLE_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.jungle');
  }
}
