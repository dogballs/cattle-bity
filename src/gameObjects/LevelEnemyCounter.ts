import { GameObject } from '../core';

import { LevelEnemyCounterItem } from './LevelEnemyCounterItem';

export class LevelEnemyCounter extends GameObject {
  // TODO: can only display 20 items as in original game there can only be
  // max 20 enemy tanks

  private count = 0;

  constructor(count = 0) {
    super(64, 320);

    this.count = count;
  }

  public setCount(nextCount: number): void {
    this.count = nextCount;

    this.removeAllChildren();
    this.addItems(nextCount);
  }

  protected setup(): void {
    this.addItems(this.count);
  }

  private addItems(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const item = new LevelEnemyCounterItem();

      const x = item.size.width * (i % 2);
      const y = item.size.height * Math.floor(i / 2);

      item.position.set(x, y);

      this.add(item);
    }
  }
}
