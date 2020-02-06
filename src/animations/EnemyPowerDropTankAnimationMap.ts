import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class EnemyPowerDropTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList([
      'tankEnemyPower.up.1',
      'tankEnemyPower.up.2',
      'tankEnemyPower.up.1',
      'tankEnemyPower.up.2',
      'tankEnemyPowerDrop.up.1',
      'tankEnemyPowerDrop.up.2',
      'tankEnemyPowerDrop.up.1',
      'tankEnemyPowerDrop.up.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList([
      'tankEnemyPower.down.1',
      'tankEnemyPower.down.2',
      'tankEnemyPower.down.1',
      'tankEnemyPower.down.2',
      'tankEnemyPowerDrop.down.1',
      'tankEnemyPowerDrop.down.2',
      'tankEnemyPowerDrop.down.1',
      'tankEnemyPowerDrop.down.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList([
      'tankEnemyPower.left.1',
      'tankEnemyPower.left.2',
      'tankEnemyPower.left.1',
      'tankEnemyPower.left.2',
      'tankEnemyPowerDrop.left.1',
      'tankEnemyPowerDrop.left.2',
      'tankEnemyPowerDrop.left.1',
      'tankEnemyPowerDrop.left.2',
    ]),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList([
      'tankEnemyPower.right.1',
      'tankEnemyPower.right.2',
      'tankEnemyPower.right.1',
      'tankEnemyPower.right.2',
      'tankEnemyPowerDrop.right.1',
      'tankEnemyPowerDrop.right.2',
      'tankEnemyPowerDrop.right.1',
      'tankEnemyPowerDrop.right.2',
    ]),
    { delay: 1, loop: true },
  );
}
