import {
  Dimensions,
  GameObject,
  SpriteAlignment,
  SpriteMaterial,
} from '../../core';

import { SpriteFactory } from '../../sprite/SpriteFactory';

export class EnemyCounterItem extends GameObject {
  public readonly material = new SpriteMaterial();

  constructor() {
    super(32, 32);

    this.material.sprite = SpriteFactory.asOne(
      'ui.enemyCounter',
      new Dimensions(28, 28),
    );
    this.material.alignment = SpriteAlignment.Center;
  }
}
