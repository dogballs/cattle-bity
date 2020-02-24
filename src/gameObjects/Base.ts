import { Animation, GameObject, Rect, Subject, Timer } from '../core';
import { TerrainFactory, TerrainType } from '../terrain';
import { Tag } from '../Tag';

import { BaseHeart } from './BaseHeart';

const WALL_REGIONS = [
  new Rect(0, 0, 128, 32),
  new Rect(0, 32, 32, 64),
  new Rect(96, 32, 32, 64),
];

export class Base extends GameObject {
  public readonly died = new Subject();
  private readonly heart = new BaseHeart();
  private readonly defenceTimer = new Timer();
  private readonly fadeAnimation: Animation<TerrainType>;
  private isFading = false;
  private lastFadeWallType: TerrainType = TerrainType.Steel;

  constructor() {
    super(128, 96);

    this.heart.position.set(32, 32);
    this.heart.died.addListener(this.died.notify);
    this.add(this.heart);

    this.setWalls(TerrainType.Brick);

    this.fadeAnimation = new Animation([TerrainType.Brick, TerrainType.Steel], {
      delay: 15,
      loop: 7,
    });

    this.defenceTimer.done.addListener(this.handleDefenceTimer);
  }

  public activateDefence(duration: number): void {
    this.resetFading();
    this.setWalls(TerrainType.Steel);
    this.defenceTimer.reset(duration);
  }

  protected update(): void {
    this.defenceTimer.tick();

    // TODO: fading logic seems a bit ugly

    if (this.isFading) {
      if (this.fadeAnimation.isComplete()) {
        this.resetFading();
        this.setWalls(TerrainType.Brick);
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

  private resetFading(): void {
    this.isFading = false;
    this.fadeAnimation.reset();
    this.lastFadeWallType = TerrainType.Steel;
  }

  private handleDefenceTimer = (): void => {
    this.isFading = true;
    this.lastFadeWallType = TerrainType.Steel;
  };

  private setWalls(wallType: TerrainType): void {
    this.removeAllWalls();

    const walls = TerrainFactory.createFromRegions(wallType, WALL_REGIONS);
    walls.forEach((wall) => {
      this.add(wall);
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
