import { Animation, Rotation } from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankAnimationMap } from './TankAnimationMap';

export class PlayerPrimaryTankAnimationMap extends TankAnimationMap {
  public [Rotation.Up] = new Animation(
    SpriteFactory.asList(['tankPlayer.up.1', 'tankPlayer.up.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Down] = new Animation(
    SpriteFactory.asList(['tankPlayer.down.1', 'tankPlayer.down.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Left] = new Animation(
    SpriteFactory.asList(['tankPlayer.left.1', 'tankPlayer.left.2']),
    { delay: 1, loop: true },
  );
  public [Rotation.Right] = new Animation(
    SpriteFactory.asList(['tankPlayer.right.1', 'tankPlayer.right.2']),
    { delay: 1, loop: true },
  );
}
