import DisplayObject from './../core/DisplayObject.js';
import Sprite from './../core/Sprite.js';
import Texture from './../core/Texture.js';

class Bullet extends DisplayObject {
  constructor() {
    super(12, 16);

    this.speed = 15;

    this.texture = new Texture('images/sprite.png');

    this.direction = 'up';

    this.sprites = {
      up: new Sprite(this.texture, {
        x: 323, y: 102, w: 3, h: 4,
      }),
      down: new Sprite(this.texture, {
        x: 339, y: 102, w: 3, h: 4,
      }),
      right: new Sprite(this.texture, {
        x: 346, y: 102, w: 4, h: 3,
      }),
      left: new Sprite(this.texture, {
        x: 330, y: 102, w: 4, h: 3,
      }),
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

    const sprite = this.sprites[this.direction];

    return {
      width,
      height,
      position: this.position,
      sprite,
    };
  }
}

export default Bullet;
