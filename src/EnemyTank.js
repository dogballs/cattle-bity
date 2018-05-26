import Actor from './Actor.js';
import Sprite from './Sprite.js';
import TextureLoader from './TextureLoader.js';

class EnemyTank extends Actor {
  constructor() {
    super(100, 100);

    this.speed = 5;

    this.direction = 'up';

    this.texture = new TextureLoader().load('images/sprite.png');

    this.sprites = {
      up: new Sprite(this.texture, { x: 129, y: 2, w: 13, h: 13 }),
      down: new Sprite(this.texture, { x: 193, y: 1, w: 13, h: 13 }),
      left: new Sprite(this.texture, { x: 162, y: 1, w: 13, h: 13 }),
      right: new Sprite(this.texture, { x: 225, y: 1, w: 13, h: 13 }),
    };

    this.sprite = this.sprites[this.direction];
  }
}

export default EnemyTank;
