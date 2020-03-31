import { GameObject, SpritePainter } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import * as config from '../../config';

export class JungleTerrainTile extends GameObject {
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.JUNGLE_TILE_SIZE, config.JUNGLE_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.jungle');
  }
}
