import { GameObject, Rect } from '../core';
import { BrickWall, SteelWall } from '../gameObjects';
import * as config from '../config';

import { TerrainType } from './TerrainType';

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

    const isMenu = type === TerrainType.MenuBrick;

    const walls = [];

    for (let i = x; i < x + width; i += config.BRICK_TILE_SIZE) {
      for (let j = y; j < y + height; j += config.BRICK_TILE_SIZE) {
        const wall = new BrickWall(isMenu);
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
}
