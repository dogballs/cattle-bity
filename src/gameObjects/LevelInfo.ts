import { GameObject } from '../core';

import { EnemyCounter } from './EnemyCounter';
import { LivesCounter } from './LivesCounter';

export class LevelInfo extends GameObject {
  private enemyCounter = new EnemyCounter();
  private livesCounter = new LivesCounter();

  constructor() {
    super(64, 768);
  }

  protected setup(): void {
    this.add(this.enemyCounter);

    this.livesCounter.position.setY(444);
    this.add(this.livesCounter);
  }

  public setLivesCount(livesCount: number): void {
    this.livesCounter.setCount(livesCount);
  }

  public setEnemyCount(enemyCount: number): void {
    this.enemyCounter.setCount(enemyCount);
  }
}
