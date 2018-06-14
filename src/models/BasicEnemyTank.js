import Animation from '../core/Animation.js';
import Sprite from '../core/Sprite.js';
import Texture from '../core/Texture.js';

import EnemyTank from './EnemyTank.js';

// TODO: create base class for tank with common behavior for both enemy and
// player tanks to avoid repetition.

class BasicEnemyTank extends EnemyTank {
  constructor() {
    super(52, 60);

    this.speed = 2;
    this.health = 1;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.direction = 'up';

    this.texture = new Texture('images/sprite.png');

    this.animations = {
      up: new Animation([
        new Sprite(this.texture, {
          x: 129, y: 64, w: 13, h: 15,
        }),
        new Sprite(this.texture, {
          x: 145, y: 64, w: 13, h: 15,
        }),
      ], { delay: 20 }),
      down: new Animation([
        new Sprite(this.texture, {
          x: 193, y: 64, w: 13, h: 15,
        }),
        new Sprite(this.texture, {
          x: 209, y: 64, w: 13, h: 15,
        }),
      ], { delay: 20 }),
      left: new Animation([
        new Sprite(this.texture, {
          x: 160, y: 66, w: 15, h: 13,
        }),
        new Sprite(this.texture, {
          x: 176, y: 66, w: 15, h: 13,
        }),
      ], { delay: 20 }),
      right: new Animation([
        new Sprite(this.texture, {
          x: 225, y: 65, w: 15, h: 13,
        }),
        new Sprite(this.texture, {
          x: 241, y: 65, w: 15, h: 13,
        }),
      ], { delay: 20 }),
    };
  }

  update() {
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

  rotate(direction) {
    this.direction = direction;
  }

  render() {
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
      width,
      height,
      position: this.position,
      sprite,
    };
  }
}

export default BasicEnemyTank;
