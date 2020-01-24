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

export class BasicEnemyTank extends EnemyTank {
  public bulletDamage: number;
  public bulletSpeed: number;
  public collider = true;
  public health: number;
  public material: SpriteMaterial = new SpriteMaterial();
  private animations: Map<GameObjectRotation, Animation<Sprite>> = new Map();
  private speed: number;

  constructor() {
    super(52, 60);

    this.speed = 2;
    this.health = 1;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.animations.set(
      GameObject.Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyBasic.up.1', 'tankEnemyBasic.up.2']),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Down,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.down.1',
          'tankEnemyBasic.down.2',
        ]),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Left,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.left.1',
          'tankEnemyBasic.left.2',
        ]),
        { delay: 1, loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyBasic.right.1',
          'tankEnemyBasic.right.2',
        ]),
        { delay: 1, loop: true },
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
