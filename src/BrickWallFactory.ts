import { Rect, Vector } from './core';

import { BrickWall } from './gameObjects';

const SIZE = 16;

class BrickWallFactory {
  public static create(x = 0, y = 0, width = 0, height = 0) {
    if (
      x % SIZE !== 0 ||
      y % SIZE !== 0 ||
      width % SIZE !== 0 ||
      height % SIZE !== 0
    ) {
      throw new Error(`Invalid options (%${SIZE})`);
    }

    const walls = [];

    for (let i = x; i < x + width; i += SIZE) {
      for (let j = y; j < y + height; j += SIZE) {
        const wall = new BrickWall();
        wall.position.set(i, j);
        walls.push(wall);
      }
    }

    return walls;
  }
}

export default BrickWallFactory;
