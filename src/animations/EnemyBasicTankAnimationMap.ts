import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class EnemyBasicTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList(['tankEnemyBasic.up.1', 'tankEnemyBasic.up.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList(['tankEnemyBasic.down.1', 'tankEnemyBasic.down.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList(['tankEnemyBasic.left.1', 'tankEnemyBasic.left.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList(['tankEnemyBasic.right.1', 'tankEnemyBasic.right.2']),
    { delay: 1, loop: true },
  );
}
