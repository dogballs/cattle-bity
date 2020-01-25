import { GameObject } from '../core';

import { BrickWall, SteelWall } from '../gameObjects';

import { MapConfig, MapConfigWallType } from './MapConfig';

export interface MapResult {
  walls: GameObject[];
}

const BRICK_WALL_MULT = 16;
const STEEL_WALL_MULT = 32;

// TODO: map config as a separate class with serialization methods and validation

export class MapFactory {
  public static create(mapConfig: MapConfig): MapResult {
    const allWalls = [];

    mapConfig.walls.forEach((wall) => {
      const { type, x, y, w, h } = wall;

      if (type === MapConfigWallType.Brick) {
        const walls = [];

        for (let i = x; i < x + w; i += BRICK_WALL_MULT) {
          for (let j = y; j < y + h; j += BRICK_WALL_MULT) {
            const wall = new BrickWall();
            wall.position.set(i, j);
            walls.push(wall);
          }
        }

        allWalls.push(...walls);
      } else if (MapConfigWallType.Steel) {
        const walls = [];

        for (let i = x; i < x + w; i += STEEL_WALL_MULT) {
          for (let j = y; j < y + h; j += STEEL_WALL_MULT) {
            const wall = new SteelWall();
            wall.position.set(i, j);
            walls.push(wall);
          }
        }

        allWalls.push(...walls);
      }
    });

    const result: MapResult = {
      walls: allWalls,
    };

    return result;
  }
}
