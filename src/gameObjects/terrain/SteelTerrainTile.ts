import { GameObject, SpritePainter } from '../../core';
import { GameObjectUpdateArgs, Tag } from '../../game';
import * as config from '../../config';

export class SteelTerrainTile extends GameObject {
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.STEEL_TILE_SIZE, config.STEEL_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.steel');
  }
}
