import { GameObject, SpritePainter } from '../../core';
import { GameObjectUpdateArgs } from '../../game';
import * as config from '../../config';

export class IceTerrainTile extends GameObject {
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.ICE_TILE_SIZE, config.ICE_TILE_SIZE);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.painter.sprite = spriteLoader.load('terrain.ice');
  }
}
