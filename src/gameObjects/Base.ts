import { Animation, GameObject, Rect, Subject, Timer } from '../core';
import { GameUpdateArgs, Tag } from '../game';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

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
  private fadeAnimation: Animation<TerrainType>;
  private isFading = false;
  private lastFadeWallType: TerrainType = TerrainType.Steel;

  constructor() {
    super(config.BASE_DEFAULT_SIZE.width, config.BASE_DEFAULT_SIZE.height);
  }

  public activateDefence(duration: number): void {
    this.resetFading();
    this.setWalls(TerrainType.Steel);
    this.defenceTimer.reset(duration);
  }

  protected setup(): void {
    this.heart.position.set(32, 32);
    this.heart.died.addListener(this.died.notify);
    this.add(this.heart);

    this.setWalls(TerrainType.Brick);

    this.fadeAnimation = new Animation([TerrainType.Brick, TerrainType.Steel], {
      delay: 0.25,
      loop: 7,
    });

    this.defenceTimer.done.addListener(this.handleDefenceTimer);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.defenceTimer.update(updateArgs.deltaTime);

    // TODO: fading logic seems a bit ugly

    if (this.isFading) {
      if (this.fadeAnimation.isComplete()) {
        this.resetFading();
        this.setWalls(TerrainType.Brick);
        return;
      }

      this.fadeAnimation.update(updateArgs.deltaTime);

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

    const walls = TerrainFactory.createMapFromRegions(wallType, WALL_REGIONS);
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
