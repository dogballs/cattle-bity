import { BoxCollider } from '../../core';
import { GameUpdateArgs, Tag } from '../../game';
import { TerrainType } from '../../terrain';
import * as config from '../../config';

import { TerrainTile } from '../TerrainTile';

import { BrickTerrainTile } from './BrickTerrainTile';

// Acts as a container for brick tiles and is used for movement collision
// resolution. Tanks are snapped to medium size tile grid, but brick tiles
// are small size. To avoid unexpected collision jumps this class serves
// as a medium size tile container - tank won't be able to move on it's
// area until all brick small-size sub-tiles have been destroyed inside it.
// Small-size brick still react to bullets, this one does not.

export class BrickSuperTerrainTile extends TerrainTile {
  public type = TerrainType.BrickSuper;
  public collider = new BoxCollider(this);
  public readonly tags = [Tag.BlockMove];
  private subTiles: BrickTerrainTile[];

  constructor(subTiles: BrickTerrainTile[]) {
    super(config.BRICK_SUPER_TILE_SIZE, config.BRICK_SUPER_TILE_SIZE);

    this.subTiles = subTiles;
  }

  public destroy(): void {
    super.destroy();
    this.collider.unregister();
  }

  protected setup({ collisionSystem }: GameUpdateArgs): void {
    collisionSystem.register(this.collider);

    for (const tile of this.subTiles) {
      // Keep track when sub-tile is destroyed - when all of them are destroyed
      // super-tile must self-destruct to allow movement on freed area.
      // Note: no need to remove from children, sub-tile will self-remove.
      tile.destroyed.addListenerOnce(() => {
        const index = this.subTiles.indexOf(tile);
        if (index === -1) {
          return;
        }
        this.subTiles.splice(index, 1);

        if (this.subTiles.length === 0) {
          this.destroy();
        }
      });
    }

    this.add(...this.subTiles);
  }

  protected update(): void {
    this.collider.update();
  }
}
