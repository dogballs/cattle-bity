import {
  Dimensions,
  GameObject,
  SpriteAlignment,
  SpriteRenderer,
} from '../../core';

import { SpriteFactory } from '../../sprite/SpriteFactory';

export class EnemyCounterItem extends GameObject {
  public readonly renderer = new SpriteRenderer();

  constructor() {
    super(32, 32);

    this.renderer.sprite = SpriteFactory.asOne(
      'ui.enemyCounter',
      new Dimensions(28, 28),
    );
    this.renderer.alignment = SpriteAlignment.Center;
  }
}
