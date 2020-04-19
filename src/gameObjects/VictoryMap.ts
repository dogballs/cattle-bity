import { GameObject, RandomUtils, Rect, Subject } from '../core';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

import { SmallExplosion } from './SmallExplosion';
import { Explosion } from './Explosion';
import { TerrainTile } from './TerrainTile';

export class VictoryMap extends GameObject {
  public tileDestroyed = new Subject();
  public destroyed = new Subject();
  private tiles: TerrainTile[] = [];
  private destroyCount = 1;
  private shouldDestroy = false;

  constructor() {
    super(config.CANVAS_WIDTH, 312);
  }

  public destroy(): void {
    if (this.tiles.length === 0) {
      this.destroyed.notify(null);
      this.shouldDestroy = false;
      return;
    }

    for (let i = 0; i < this.destroyCount; i += 1) {
      const tile = RandomUtils.arrayElement(this.tiles);
      if (tile === undefined) {
        return;
      }

      const index = this.tiles.indexOf(tile);
      tile.destroy();
      this.tiles.splice(index, 1);
    }

    this.destroyCount += 1;
  }

  protected setup(): void {
    this.tiles = TerrainFactory.createFromRegions(TerrainType.Brick, [
      new Rect(0, 0, this.size.width, this.size.height),
    ]);

    this.tiles.forEach((tile) => {
      tile.destroyed.addListener(this.handleTileDestroyed);
    });

    this.add(...this.tiles);
  }

  protected update(): void {
    if (this.shouldDestroy === false) {
      return;
    }

    this.destroy();
  }

  private handleTileDestroyed = (event): void => {
    // Whenever tank destroys first tile - the whole show begins
    this.shouldDestroy = true;

    let explosion: Explosion | SmallExplosion;

    if (RandomUtils.number(0, 2) === 0) {
      explosion = new Explosion();
    } else {
      explosion = new SmallExplosion();
    }

    explosion.updateMatrix();
    explosion.setCenter(event.centerPosition);
    this.add(explosion);

    this.tileDestroyed.notify(null);
  };
}
