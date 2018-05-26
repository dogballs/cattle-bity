import Sprite from './Sprite.js';
import Actor from './Actor.js';
import TextureLoader from './TextureLoader.js';

class Tank extends Actor {
  constructor() {
    super(100, 100);

    this.speed = 5;

    this.direction = 'up';

    this.texture = new TextureLoader().load('images/sprite.png');

    this.sprites = {
      up: new Sprite(this.texture, { x: 1, y: 2, w: 13, h: 13 }),
      down: new Sprite(this.texture, { x: 65, y: 1, w: 13, h: 13 }),
      left: new Sprite(this.texture, { x: 34, y: 1, w: 13, h: 13 }),
      right: new Sprite(this.texture, { x: 97, y: 1, w: 13, h: 13 }),
    };

    this.sprite = this.sprites[this.direction];
  }

  moveUp() {
    this.position.y -= this.speed;
    this.direction = 'up';
    this.sprite = this.sprites[this.direction];
  }

  moveDown() {
    this.position.y += this.speed;
    this.direction = 'down';
    this.sprite = this.sprites[this.direction];
  }

  moveRight() {
    this.position.x += this.speed;
    this.direction = 'right';
    this.sprite = this.sprites[this.direction];
  }

  moveLeft() {
    this.position.x -= this.speed;
    this.direction = 'left';
    this.sprite = this.sprites[this.direction];
  }
}

export default Tank;
