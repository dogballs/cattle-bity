import { GameObject, Rect } from '../core';
import { BrickWall, SteelWall } from '../gameObjects';
import * as config from '../config';

import { TerrainType } from './TerrainType';

export interface TerrainRegionConfig {
  type: TerrainType;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class TerrainFactory {
  public static createFromRegion(
    type: TerrainType,
    regionRect: Rect,
  ): GameObject[] {
    const { x, y, width, height } = regionRect;

    if (type === TerrainType.Steel) {
      const walls = [];

      for (let i = x; i < x + width; i += config.STEEL_TILE_SIZE) {
        for (let j = y; j < y + height; j += config.STEEL_TILE_SIZE) {
          const wall = new SteelWall();
          wall.position.set(i, j);
          walls.push(wall);
        }
      }

      return walls;
    }

    const walls = [];

    for (let i = x; i < x + width; i += config.BRICK_TILE_SIZE) {
      for (let j = y; j < y + height; j += config.BRICK_TILE_SIZE) {
        const wall = new BrickWall(type);
        wall.position.set(i, j);
        walls.push(wall);
      }
    }

    return walls;
  }

  public static createFromRegions(
    type: TerrainType,
    regionRects: Rect[],
  ): GameObject[] {
    const allWalls = [];

    regionRects.forEach((regionRect) => {
      const walls = this.createFromRegion(type, regionRect);
      allWalls.push(...walls);
    });

    return allWalls;
  }

  public static createFromRegionConfigs(
    regions: TerrainRegionConfig[],
  ): GameObject[] {
    const tiles = [];

    regions.forEach((region) => {
      const regionRect = new Rect(
        region.x,
        region.y,
        region.width,
        region.height,
      );
      const regionTiles = this.createFromRegion(region.type, regionRect);
      tiles.push(...regionTiles);
    });

    return tiles;
  }
}
