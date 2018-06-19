import Animation from '../core/Animation';

import SpriteFactory from '../sprite/SpriteFactory';

import EnemyTank from './EnemyTank';

// TODO: create base class for tank with common behavior for both enemy and
// player tanks to avoid repetition.

class BasicEnemyTank extends EnemyTank {
  public bulletDamage: number;
  public bulletSpeed: number;
  public health: number;
  private animations: object;
  private direction: string;
  private speed: number;

  constructor() {
    super(52, 60);

    this.speed = 2;
    this.health = 1;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.direction = 'up';

    this.animations = {
      down: new Animation(SpriteFactory.asList([
        'tankEnemyBasic.down.1',
        'tankEnemyBasic.down.2',
      ]), { delay: 20 }),
      left: new Animation(SpriteFactory.asList([
        'tankEnemyBasic.left.1',
        'tankEnemyBasic.left.2',
      ]), { delay: 20 }),
      right: new Animation(SpriteFactory.asList([
        'tankEnemyBasic.right.1',
        'tankEnemyBasic.right.2',
      ]), { delay: 20 }),
      up: new Animation(SpriteFactory.asList([
        'tankEnemyBasic.up.1',
        'tankEnemyBasic.up.2',
      ]), { delay: 20 }),
    };
  }

  public update() {
    if (this.direction === 'up') {
      this.position.y -= this.speed;
    } else if (this.direction === 'down') {
      this.position.y += this.speed;
    } else if (this.direction === 'right') {
      this.position.x += this.speed;
    } else if (this.direction === 'left') {
      this.position.x -= this.speed;
    }

    const animation = this.animations[this.direction];
    animation.animate();
  }

  public rotate(direction) {
    this.direction = direction;
  }

  public render() {
    let { width, height } = this;

    // Bullet has rectangular shape. If it is rotated, swap width and height
    // for rendering.
    if (this.direction === 'right' || this.direction === 'left') {
      width = this.height;
      height = this.width;
    }

    const animation = this.animations[this.direction];
    const sprite = animation.getCurrentFrame();

    return {
      height,
      sprite,
      width,
    };
  }
}

export default BasicEnemyTank;
