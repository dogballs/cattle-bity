import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class EnemyPowerTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList(['tankEnemyPower.up.1', 'tankEnemyPower.up.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList(['tankEnemyPower.down.1', 'tankEnemyPower.down.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList(['tankEnemyPower.left.1', 'tankEnemyPower.left.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList(['tankEnemyPower.right.1', 'tankEnemyPower.right.2']),
    { delay: 1, loop: true },
  );
}
