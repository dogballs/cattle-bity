import { GameObject } from '../core';

import { BrickWall, SteelWall } from '../gameObjects';

export interface MapConfigWall {
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MapConfig {
  walls?: MapConfigWall[];
}

export interface MapResult {
  objects: GameObject[];
}

const BRICK_WALL_MULT = 16;
const STEEL_WALL_MULT = 32;

// TODO: map config as a separate class with serialization methods and validation

export class MapFactory {
  public static create(mapConfig: MapConfig = {}): MapResult {
    const objects = [];

    mapConfig.walls.forEach((wall) => {
      const { type, x, y, w, h } = wall;

      if (type === 'brick') {
        if (
          x % BRICK_WALL_MULT !== 0 ||
          y % BRICK_WALL_MULT !== 0 ||
          w % BRICK_WALL_MULT !== 0 ||
          h % BRICK_WALL_MULT !== 0
        ) {
          throw new Error(
            `Invalid options for brick wall (%${BRICK_WALL_MULT})`,
          );
        }

        const walls = [];

        for (let i = x; i < x + w; i += BRICK_WALL_MULT) {
          for (let j = y; j < y + h; j += BRICK_WALL_MULT) {
            const wall = new BrickWall();
            wall.position.set(i, j);
            walls.push(wall);
          }
        }

        objects.push(...walls);
      } else if (type === 'steel') {
        if (
          x % STEEL_WALL_MULT !== 0 ||
          y % STEEL_WALL_MULT !== 0 ||
          w % STEEL_WALL_MULT !== 0 ||
          h % STEEL_WALL_MULT !== 0
        ) {
          throw new Error(
            `Invalid options for steel wall(%${STEEL_WALL_MULT})`,
          );
        }

        const walls = [];

        for (let i = x; i < x + w; i += STEEL_WALL_MULT) {
          for (let j = y; j < y + h; j += STEEL_WALL_MULT) {
            const wall = new SteelWall();
            wall.position.set(i, j);
            walls.push(wall);
          }
        }

        objects.push(...walls);
      }
    });

    const result: MapResult = {
      objects,
    };

    return result;
  }
}
