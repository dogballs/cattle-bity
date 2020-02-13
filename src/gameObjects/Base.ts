import { Animation, GameObject, Rect, Subject, Timer } from '../core';
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

enum WallType {
  Brick,
  Steel,
}

export class Base extends GameObject {
  public readonly died = new Subject();
  private readonly heart = new BaseHeart();
  private readonly defenceTimer = new Timer();
  private readonly fadeAnimation: Animation<WallType>;
  private isFading = false;
  private lastFadeWallType: WallType = WallType.Steel;

  constructor() {
    super(128, 96);

    this.heart.position.set(32, 32);
    this.heart.died.addListener(this.died.notify);
    this.add(this.heart);

    this.setWalls(WallType.Brick);

    this.fadeAnimation = new Animation([WallType.Brick, WallType.Steel], {
      delay: 15,
      loop: 7,
    });

    this.defenceTimer.done.addListener(this.handleDefenceTimer);
  }

  public update(): void {
    this.defenceTimer.tick();

    // TODO: fading logic seems a bit ugly

    if (this.isFading) {
      if (this.fadeAnimation.isComplete()) {
        this.resetFading();
        this.setWalls(WallType.Brick);
        return;
      }

      this.fadeAnimation.animate();

      const fadeWallType = this.fadeAnimation.getCurrentFrame();
      if (this.lastFadeWallType !== fadeWallType) {
        this.lastFadeWallType = fadeWallType;
        this.setWalls(fadeWallType);
      }
    }
  }

  public activateDefence(duration: number): void {
    this.resetFading();
    this.setWalls(WallType.Steel);
    this.defenceTimer.reset(duration);
  }

  private resetFading(): void {
    this.isFading = false;
    this.fadeAnimation.reset();
    this.lastFadeWallType = WallType.Steel;
  }

  private handleDefenceTimer = (): void => {
    this.isFading = true;
    this.lastFadeWallType = WallType.Steel;
  };

  private setWalls(wallType: WallType): void {
    this.removeAllWalls();
    if (wallType === WallType.Brick) {
      this.addBrickWalls();
    } else {
      this.addSteelWalls();
    }
  }

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
}
