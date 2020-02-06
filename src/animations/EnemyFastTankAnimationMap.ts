import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class EnemyFastTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList(['tankEnemyFast.up.1', 'tankEnemyFast.up.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList(['tankEnemyFast.down.1', 'tankEnemyFast.down.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList(['tankEnemyFast.left.1', 'tankEnemyFast.left.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList(['tankEnemyFast.right.1', 'tankEnemyFast.right.2']),
    { delay: 1, loop: true },
  );
}
