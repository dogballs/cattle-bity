import { Collider, GameObject, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import * as config from '../../config';

export class SteelTerrainTile extends GameObject {
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
