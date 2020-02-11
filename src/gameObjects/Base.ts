import { GameObject, Rect } from '../core';

import { BaseHeart } from './BaseHeart';
import { BrickWall } from './BrickWall';

const BRICK_WALL_MULT = 16;

export class Base extends GameObject {
  private readonly heart = new BaseHeart();

  constructor() {
    super(128, 96);

    const walls = [
      new Rect(0, 0, 128, 32),
      new Rect(0, 32, 32, 64),
      new Rect(96, 32, 32, 64),
    ];

    walls.forEach((wall) => {
      for (let x = wall.x; x < wall.x + wall.width; x += BRICK_WALL_MULT) {
        for (let y = wall.y; y < wall.y + wall.height; y += BRICK_WALL_MULT) {
          const wall = new BrickWall();
          wall.position.set(x, y);
          this.add(wall);
        }
      }
    });

    this.heart.position.set(32, 32);
    this.add(this.heart);
  }
}
