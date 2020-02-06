import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class EnemyBasicDropTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList([
      'tankEnemyBasic.up.1',
      'tankEnemyBasic.up.2',
      'tankEnemyBasic.up.1',
      'tankEnemyBasic.up.2',
      'tankEnemyBasicDrop.up.1',
      'tankEnemyBasicDrop.up.2',
      'tankEnemyBasicDrop.up.1',
      'tankEnemyBasicDrop.up.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList([
      'tankEnemyBasic.down.1',
      'tankEnemyBasic.down.2',
      'tankEnemyBasic.down.1',
      'tankEnemyBasic.down.2',
      'tankEnemyBasicDrop.down.1',
      'tankEnemyBasicDrop.down.2',
      'tankEnemyBasicDrop.down.1',
      'tankEnemyBasicDrop.down.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList([
      'tankEnemyBasic.left.1',
      'tankEnemyBasic.left.2',
      'tankEnemyBasic.left.1',
      'tankEnemyBasic.left.2',
      'tankEnemyBasicDrop.left.1',
      'tankEnemyBasicDrop.left.2',
      'tankEnemyBasicDrop.left.1',
      'tankEnemyBasicDrop.left.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList([
      'tankEnemyBasic.right.1',
      'tankEnemyBasic.right.2',
      'tankEnemyBasic.right.1',
      'tankEnemyBasic.right.2',
      'tankEnemyBasicDrop.right.1',
      'tankEnemyBasicDrop.right.2',
      'tankEnemyBasicDrop.right.1',
      'tankEnemyBasicDrop.right.2',
    ]),
    { delay: 1, loop: true },
  );
}
