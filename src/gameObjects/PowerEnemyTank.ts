import Animation from '../core/Animation';
import GameObject from '../core/GameObject';
import SpriteMaterial from '../core/SpriteMaterial';

import SpriteFactory from '../sprite/SpriteFactory';

import EnemyTank from './EnemyTank';

// TODO: create base class for tank with common behavior for both enemy and
// player tanks to avoid repetition.

class BasicEnemyTank extends EnemyTank {
  public bulletDamage: number;
  public bulletSpeed: number;
  public health: number;
  private animations: object;
  private speed: number;

  constructor() {
    super(52, 60);

    this.speed = 3;
    this.health = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 15;

    this.animations = {
      [GameObject.Rotation.Up]: new Animation(SpriteFactory.asList([
        'tankEnemyPower.up.1',
        'tankEnemyPower.up.1',
      ])),
      [GameObject.Rotation.Down]: new Animation(SpriteFactory.asList([
        'tankEnemyPower.down.1',
        'tankEnemyPower.down.2',
      ])),
      [GameObject.Rotation.Left]: new Animation(SpriteFactory.asList([
        'tankEnemyPower.left.1',
        'tankEnemyPower.left.1',
      ])),
      [GameObject.Rotation.Right]: new Animation(SpriteFactory.asList([
        'tankEnemyPower.right.1',
        'tankEnemyPower.right.1',
      ])),
    };

    this.material = new SpriteMaterial();
  }

  public update() {
    if (this.rotation === GameObject.Rotation.Up) {
      this.position.y -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Down) {
      this.position.y += this.speed;
    } else if (this.rotation === GameObject.Rotation.Left) {
      this.position.x -= this.speed;
    } else if (this.rotation === GameObject.Rotation.Right) {
      this.position.x += this.speed;
    }

    const animation = this.animations[this.rotation];
    animation.animate();

    const sprite = animation.getCurrentFrame();
    this.material.sprite = sprite;
  }
}

export default BasicEnemyTank;
