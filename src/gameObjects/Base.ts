import { GameObject, Rect, Subject, Timer } from '../core';
import { Tag } from '../Tag';

import { BaseHeart } from './BaseHeart';
import { BrickWall } from './BrickWall';
import { SteelWall } from './SteelWall';

const BRICK_WALL_MULT = 16;
const STEEL_WALL_MULT = 32;

const WALL_RECTS = [
  new Rect(0, 0, 128, 32),
  new Rect(0, 32, 32, 64),
  new Rect(96, 32, 32, 64),
];

export class Base extends GameObject {
  public readonly died = new Subject();
  private readonly heart = new BaseHeart();
  private readonly defenceTimer = new Timer();

  constructor() {
    super(128, 96);

    this.addBrickWalls();

    this.heart.position.set(32, 32);
    this.heart.died.addListener(this.handleHeartDied);
    this.add(this.heart);

    this.defenceTimer.done.addListener(this.handleDefenceTimer);
  }

  public update(): void {
    this.defenceTimer.tick();
  }

  public activateDefence(duration: number): void {
    this.defenceTimer.reset(duration);

    this.removeAllWalls();
    this.addSteelWalls();
  }

  private handleDefenceTimer = (): void => {
    this.removeAllWalls();
    this.addBrickWalls();
  };

  private addBrickWalls(): void {
    // TODO: code is repeated in MapFactory, should create wall factory
    WALL_RECTS.forEach((wall) => {
      for (let x = wall.x; x < wall.x + wall.width; x += BRICK_WALL_MULT) {
        for (let y = wall.y; y < wall.y + wall.height; y += BRICK_WALL_MULT) {
          const wall = new BrickWall();
          wall.position.set(x, y);
          this.add(wall);
        }
      }
    });
  }

  private addSteelWalls(): void {
    WALL_RECTS.forEach((wall) => {
      for (let x = wall.x; x < wall.x + wall.width; x += STEEL_WALL_MULT) {
        for (let y = wall.y; y < wall.y + wall.height; y += STEEL_WALL_MULT) {
          const wall = new SteelWall();
          wall.position.set(x, y);
          this.add(wall);
        }
      }
    });
  }

  private removeAllWalls(): void {
    this.children.forEach((child) => {
      if (child.tags.includes(Tag.Wall)) {
        child.removeSelf();
      }
    });
  }

  private handleHeartDied = (): void => {
    this.died.notify();
  };
}
