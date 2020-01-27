import { Animation, Rotation } from '../core';

import { Shield } from './Shield';
import { Tag } from './Tag';
import { Tank } from './Tank';
import { PlayerStrategy, Strategy } from '../strategy';
import { SpriteFactory } from '../sprite/SpriteFactory';

export class PlayerTank extends Tank {
  public strategy: Strategy = new PlayerStrategy();
  public tags = [Tag.Tank];
  protected speed = 3;

  constructor() {
    super(52, 52);

    this.animations.set(
      Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankPlayer.up.1', 'tankPlayer.up.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Down,
      new Animation(
        SpriteFactory.asList(['tankPlayer.down.1', 'tankPlayer.down.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Left,
      new Animation(
        SpriteFactory.asList(['tankPlayer.left.1', 'tankPlayer.left.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      Rotation.Right,
      new Animation(
        SpriteFactory.asList(['tankPlayer.right.1', 'tankPlayer.right.2']),
        { loop: true },
      ),
    );

    const shield = new Shield();
    shield.setCenterFrom(this);
    this.add(shield);

    this.material.sprite = this.animations.get(this.rotation).getCurrentFrame();
  }
}
