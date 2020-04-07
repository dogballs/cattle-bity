import { GameObject } from '../core';

import { LevelEnemyCounter } from './LevelEnemyCounter';
import { LevelLivesCounter } from './LevelLivesCounter';
import { LevelNumberCounter } from './LevelNumberCounter';

export class LevelInfo extends GameObject {
  private enemyCounter = new LevelEnemyCounter();
  private livesCounter = new LevelLivesCounter();
  private levelNumberCounter = new LevelNumberCounter();

  constructor() {
    super(64, 768);
  }

  protected setup(): void {
    this.add(this.enemyCounter);

    this.livesCounter.position.setY(444);
    this.add(this.livesCounter);

    this.levelNumberCounter.position.setY(636);
    this.add(this.levelNumberCounter);
  }

  public setLevelNumber(levelNumber: number): void {
    this.levelNumberCounter.setLevelNumber(levelNumber);
  }

  public setLivesCount(livesCount: number): void {
    this.livesCounter.setCount(livesCount);
  }

  public setEnemyCount(enemyCount: number): void {
    this.enemyCounter.setCount(enemyCount);
  }
}
