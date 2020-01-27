import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { EnemyTank } from './EnemyTank';

export class PowerEnemyTank extends EnemyTank {
  public bulletSpeed = 15;
  protected health = 3;
  protected speed = 2;

  constructor() {
    super(52, 60);

    this.animations.set(
      Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyPower.up.1', 'tankEnemyPower.up.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Down,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.down.1',
          'tankEnemyPower.down.2',
        ]),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Left,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.left.1',
          'tankEnemyPower.left.2',
        ]),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.right.1',
          'tankEnemyPower.right.2',
        ]),
        { loop: true },
      ),
    );

    this.material.sprite = this.animations.get(this.rotation).getCurrentFrame();
  }
}
