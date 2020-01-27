import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';
import { Strategy, StandFireStrategy } from '../strategy';

import { EnemyTank } from './EnemyTank';

export class BasicEnemyTank extends EnemyTank {
  public strategy: Strategy = new StandFireStrategy();

  constructor() {
    super(52, 60);

    this.animations.set(
      Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyBasic.up.1', 'tankEnemyBasic.up.2']),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Down,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.down.1',
          'tankEnemyBasic.down.2',
        ]),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Left,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.left.1',
          'tankEnemyBasic.left.2',
        ]),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.right.1',
          'tankEnemyBasic.right.2',
        ]),
        { delay: 1, loop: true },
      ),
    );

    this.material.sprite = this.animations.get(this.rotation).getCurrentFrame();
  }
}
