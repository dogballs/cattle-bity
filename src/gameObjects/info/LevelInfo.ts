import { GameObject } from '../../core';
import { GameUpdateArgs } from '../../game';
import * as config from '../../config';

import { LevelEnemyCounter } from './LevelEnemyCounter';
import { LevelLivesCounter } from './LevelLivesCounter';
import { LevelNumberCounter } from './LevelNumberCounter';

export class LevelInfo extends GameObject {
  public zIndex = config.LEVEL_INFO_Z_INDEX;
  private enemyCounter = new LevelEnemyCounter();
  private primaryLivesCounter = new LevelLivesCounter(0);
  private secondaryLivesCounter = new LevelLivesCounter(1);
  private levelNumberCounter = new LevelNumberCounter();

  constructor() {
    super(64, 768);
  }

  protected setup({ session }: GameUpdateArgs): void {
    this.add(this.enemyCounter);

    this.primaryLivesCounter.position.setY(444);
    this.add(this.primaryLivesCounter);

    if (session.isMultiplayer()) {
      this.secondaryLivesCounter.position.setY(540);
      this.add(this.secondaryLivesCounter);
    }

    this.levelNumberCounter.position.setY(636);
    this.add(this.levelNumberCounter);
  }

  public setLevelNumber(levelNumber: number): void {
    this.levelNumberCounter.setLevelNumber(levelNumber);
  }

  public setLivesCount(playerIndex: number, livesCount: number): void {
    if (playerIndex === 0) {
      this.primaryLivesCounter.setCount(livesCount);
    }
    if (playerIndex === 1) {
      this.secondaryLivesCounter.setCount(livesCount);
    }
  }

  public setEnemyCount(enemyCount: number): void {
    this.enemyCounter.setCount(enemyCount);
  }
}
