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

export class PowerEnemyTank extends EnemyTank {
  public bulletDamage: number;
  public bulletSpeed: number;
  public collider = true;
  public health: number;
  public material: SpriteMaterial = new SpriteMaterial();
  private animations: Map<GameObjectRotation, Animation<Sprite>> = new Map();
  private speed: number;

  constructor() {
    super(52, 60);

    this.speed = 3;
    this.health = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 15;

    this.animations.set(
      GameObject.Rotation.Up,
      new Animation(
        SpriteFactory.asList(['tankEnemyPower.up.1', 'tankEnemyPower.up.2']),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Down,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.down.1',
          'tankEnemyPower.down.2',
        ]),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Left,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.left.1',
          'tankEnemyPower.left.2',
        ]),
        { loop: true },
      ),
    );
    this.animations.set(
      GameObject.Rotation.Right,
      new Animation(
        SpriteFactory.asList([
          'tankEnemyPower.right.1',
          'tankEnemyPower.right.2',
        ]),
        { loop: true },
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
