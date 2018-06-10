import Animation from '../core/Animation.js';
import DisplayObject from '../core/DisplayObject.js';
import Sprite from '../core/Sprite.js';
import Texture from '../core/Texture.js';

// TODO: create base class for tank with common behavior for both enemy and
// player tanks to avoid repetition.

class EnemyTank extends DisplayObject {
  constructor() {
    super(52, 52);

    this.speed = 4;

    this.direction = 'up';

    this.texture = new Texture('images/sprite.png');

    this.animations = {
      up: new Animation([
        new Sprite(this.texture, {
          x: 129, y: 2, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 145, y: 2, w: 13, h: 13,
        }),
      ]),
      down: new Animation([
        new Sprite(this.texture, {
          x: 193, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 209, y: 1, w: 13, h: 13,
        }),
      ]),
      right: new Animation([
        new Sprite(this.texture, {
          x: 162, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 178, y: 1, w: 13, h: 13,
        }),
      ]),
      left: new Animation([
        new Sprite(this.texture, {
          x: 225, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 241, y: 1, w: 13, h: 13,
        }),
      ]),
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
    const animation = this.animations[this.direction];
    const sprite = animation.getCurrentFrame();

    return {
      width: this.width,
      height: this.height,
      position: this.position,
      sprite,
    };
  }
}

export default EnemyTank;
