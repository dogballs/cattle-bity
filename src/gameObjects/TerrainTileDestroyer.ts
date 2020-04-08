import { Collider, Collision, GameObject } from '../core';
import { Tag } from '../game';
import * as config from '../config';

import { TerrainTile } from './TerrainTile';

const MAX_DAMAGE = 2;

export class TerrainTileDestroyer extends GameObject {
  public readonly collider: Collider;
  public readonly damage: number;

  constructor(argDamage: number) {
    const damage = Math.min(argDamage, MAX_DAMAGE);

    const width = config.TILE_SIZE_LARGE;
    const depth = config.TILE_SIZE_SMALL * damage;

    super(width, depth);

    this.damage = damage;
    this.collider = new Collider(true);
  }

  public collide({ other }: Collision): void {
    const isBrickWall =
      other.tags.includes(Tag.Wall) && other.tags.includes(Tag.Brick);
    const isSteelWall =
      other.tags.includes(Tag.Wall) && other.tags.includes(Tag.Steel);

    if (isBrickWall || (isSteelWall && this.damage === 2)) {
      const tile = other as TerrainTile;
      tile.destroy();
      this.removeSelf();
    }
  }
}
