import {
  Animation,
  GameObject,
  GameObjectRotation,
  Sprite,
  SpriteMaterial,
} from '../core';

import { SpriteFactory } from '../sprite/SpriteFactory';

import { EnemyTank } from './EnemyTank';

// TODO: create base class for tank with common behavior for both enemy and
// player tanks to avoid repetition.

export class FastEnemyTank extends EnemyTank {
  public bulletDamage: number;
  public bulletSpeed: number;
  public health: number;
  public material: SpriteMaterial = new SpriteMaterial();
  private animations: Map<GameObjectRotation, Animation<Sprite>> = new Map();
  private speed: number;

  constructor() {
    super(52, 60);

    this.speed = 4;
    this.health = 2;
    this.bulletDamage = 1;
    this.bulletSpeed = 13;

    this.animations.set(
      GameObject.Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.up.1', 'tankEnemyFast.up.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Down,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.down.1', 'tankEnemyFast.down.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Left,
      new Animation(
        SpriteFactory.asList(['tankEnemyFast.left.1', 'tankEnemyFast.left.2']),
        { delay: 2, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyFast.right.1',
          'tankEnemyFast.right.2',
        ]),
        { delay: 2, loop: true },
      ),
    );
  }

  public update({ ticks }): void {
    if (this.rotation === GameObject.Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === GameObject.Rotation.Left) {
      this.position.x -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Right) {
      this.position.x += this.speed;
    }

    const animation = this.animations.get(this.rotation);
    animation.animate(ticks);

    this.material.sprite = animation.getCurrentFrame();
  }
}
