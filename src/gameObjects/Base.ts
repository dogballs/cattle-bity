import { Animation, GameObject, Rect, Subject, Timer } from '../core';
import { GameUpdateArgs } from '../game';
import { TerrainFactory, TerrainType } from '../terrain';
import * as config from '../config';

import { BaseHeart } from './BaseHeart';
import { TerrainTile } from './TerrainTile';

const WALL_REGIONS = [
  new Rect(0, 0, 128, 32),
  new Rect(0, 32, 32, 64),
  new Rect(96, 32, 32, 64),
];

export class Base extends GameObject {
  public died = new Subject();
  private heart = new BaseHeart();
  private container: GameObject;
  private defenceTimer = new Timer();
  private fadeAnimation: Animation<TerrainType>;
  private isFading = false;
  private lastFadeWallType: TerrainType = TerrainType.Steel;

  constructor() {
    super(config.BASE_DEFAULT_SIZE.width, config.BASE_DEFAULT_SIZE.height);
  }

  public activateDefence(duration: number): void {
    this.resetFading();
    this.setTiles(TerrainType.Steel);
    this.defenceTimer.reset(duration);
  }

  protected setup(): void {
    this.container = new GameObject();
    this.container.size.copyFrom(this.size);
    this.add(this.container);

    this.heart.position.set(32, 32);
    this.heart.died.addListener(this.died.notify);
    this.add(this.heart);

    this.setTiles(TerrainType.Brick);

    this.fadeAnimation = new Animation([TerrainType.Brick, TerrainType.Steel], {
      delay: 0.25,
      loop: 7,
    });

    this.defenceTimer.done.addListener(this.handleDefenceTimer);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.defenceTimer.update(updateArgs.deltaTime);

    if (this.isFading) {
      if (this.fadeAnimation.isComplete()) {
        this.resetFading();
        this.setTiles(TerrainType.Brick);
        return;
      }

      this.fadeAnimation.update(updateArgs.deltaTime);

      const fadeWallType = this.fadeAnimation.getCurrentFrame();
      if (this.lastFadeWallType !== fadeWallType) {
        this.lastFadeWallType = fadeWallType;
        this.setTiles(fadeWallType);
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

  private setTiles(type: TerrainType): void {
    // Iterate in reverse because we are removing elements
    for (let i = this.container.children.length - 1; i >= 0; i -= 1) {
      const oldTile = this.container.children[i] as TerrainTile;
      // Make sure colliders are unregistered
      oldTile.destroy();
    }

    const tiles = TerrainFactory.createMapFromRegions(type, WALL_REGIONS);
    tiles.forEach((tile) => {
      this.container.add(tile);
    });
  }
}
