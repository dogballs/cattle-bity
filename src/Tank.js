import InputHandler from './InputHandler.js';
import Sprite from './Sprite.js';
import Actor from './Actor.js';
import TextureLoader from './TextureLoader.js';

class Tank extends Actor {
  constructor() {
    super(100, 100);

    this.speed = 5;

    this.texture = new TextureLoader().load('images/sprite.png');

    this.sprites = {
      up: new Sprite(this.texture, { x: 1, y: 2, w: 13, h: 13 }),
      down: new Sprite(this.texture, { x: 65, y: 1, w: 13, h: 13 }),
      left: new Sprite(this.texture, { x: 34, y: 1, w: 13, h: 13 }),
      right: new Sprite(this.texture, { x: 97, y: 1, w: 13, h: 13 }),
    };

    this.sprite = this.sprites.up;
  }

  moveUp() {
    this.position.y -= this.speed;
    this.sprite = this.sprites.up;
  }

  moveDown() {
    this.position.y += this.speed;
    this.sprite = this.sprites.down;
  }

  moveRight() {
    this.position.x += this.speed;
    this.sprite = this.sprites.right;
  }

  moveLeft() {
    this.position.x -= this.speed;
    this.sprite = this.sprites.left;
  }
}

export default Tank;
