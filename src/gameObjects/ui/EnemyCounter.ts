import { GameObject, SpriteRenderer } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';

export class EnemyCounter extends GameObject {
  // TODO: can only display 20 items as in original game there can only be
  // max 20 enemy tanks

  constructor(count = 0) {
    super(64, 320);

    this.append(count);
  }

  public updateCount(nextCount: number): void {
    this.clear();
    this.append(nextCount);
  }

  private append(count: number): void {
    const renderer = new SpriteRenderer();
    renderer.sprite = SpriteFactory.asOne('ui.enemy');

    for (let i = 0; i < count; i += 1) {
      const item = new GameObject(32, 32);
      item.renderer = renderer;

      const x = item.size.width * (i % 2);
      const y = item.size.height * Math.floor(i / 2);

      item.position.set(x, y);

      this.add(item);
    }
  }
}
