import Actor from './Actor.js';
import Sprite from './Sprite.js';
import TextureLoader from './TextureLoader.js';

class Shell extends Actor {
  constructor() {
    super(15, 20);

    this.speed = 15;

    this.texture = new TextureLoader().load('images/sprite.png');

    this.direction = 'up';

    this.sprites = {
      up: new Sprite(this.texture, { x: 323, y: 102, w: 3, h: 4 }),
      down: new Sprite(this.texture, { x: 339, y: 102, w: 3, h: 4 }),
      right: new Sprite(this.texture, { x: 346, y: 102, w: 4, h: 3 }),
      left: new Sprite(this.texture, { x: 330, y: 102, w: 4, h: 3 }),
    };

    this.sprite = this.sprites[this.direction];
  }

  move() {
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

  render() {
    let width = this.width;
    let height = this.height;

    // Shell has rectangular shape. If it is rotated, swap width and height
    // for rendering.
    if (this.direction === 'right' || this.direction === 'left') {
      width = this.height;
      height = this.width;
    }

    return {
      width,
      height,
      position: this.position,
      sprite: this.sprite,
    };
  }
}

export default Shell;
