import { GameObject } from '../core';

import { EnemyCounter } from './EnemyCounter';

export class LevelInfo extends GameObject {
  private enemyCounter = new EnemyCounter();

  constructor() {
    super(64, 768);
  }

  protected setup(): void {
    this.add(this.enemyCounter);
  }

  public setEnemyCount(enemyCount: number): void {
    this.enemyCounter.setCount(enemyCount);
  }
}
