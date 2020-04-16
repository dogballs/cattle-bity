import { BoxCollider, SpritePainter } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

export class SteelTerrainTile extends TerrainTile {
  public type = TerrainType.Steel;
  public collider = new BoxCollider(this);
  public zIndex = config.STEEL_TILE_Z_INDEX;
  public tags = [Tag.Wall, Tag.Steel, Tag.BlockMove];
  public readonly painter = new SpritePainter();

  constructor() {
    super(config.STEEL_TILE_SIZE, config.STEEL_TILE_SIZE);
  }

  public destroy(): void {
    super.destroy();
    this.collider.unregister();
  }

  protected setup({ collisionSystem, spriteLoader }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    this.painter.sprite = spriteLoader.load('terrain.steel');
  }

  protected update(): void {
    this.collider.update();
  }
}
