import { BoxCollider, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class IceTerrainTile extends TerrainTile {
  public collider = new BoxCollider(this);
  public type = TerrainType.Ice;
  public painter = new SpritePainter();
  public tags = [Tag.Ice];
  public zIndex = config.ICE_TILE_Z_INDEX;

  constructor() {
    super(config.ICE_TILE_SIZE, config.ICE_TILE_SIZE);
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    this.painter.sprite = spriteLoader.load('terrain.ice');
  }

  protected update(): void {
    this.collider.update();
  }
}
