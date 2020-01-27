import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { EnemyTank } from './EnemyTank';

export class FastEnemyTank extends EnemyTank {
  protected bulletSpeed = 13;
  protected health = 2;
  protected speed = 4;

  constructor() {
    super(52, 60);

    this.animations.set(
      Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.up.1', 'tankEnemyFast.up.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Down,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.down.1', 'tankEnemyFast.down.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Left,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.left.1', 'tankEnemyFast.left.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyFast.right.1',
          'tankEnemyFast.right.2',
        ]),
        { delay: 2, loop: true },
      ),
    );

    this.material.sprite = this.animations.get(this.rotation).getCurrentFrame();
  }
}
