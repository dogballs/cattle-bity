import Animation from '../core/Animation';
import DisplayObject from '../core/DisplayObject';
import KeyboardInput from '../core/KeyboardInput';
import Sprite from '../core/Sprite';
import Texture from '../core/Texture';

class Tank extends DisplayObject {
  constructor() {
    super(52, 52);

    this.speed = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.direction = 'up';

    this.texture = new Texture('images/sprite.png');

    this.animations = {
      up: new Animation([
        new Sprite(this.texture, {
          x: 1, y: 2, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 17, y: 2, w: 13, h: 13,
        }),
      ]),
      down: new Animation([
        new Sprite(this.texture, {
          x: 65, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 81, y: 1, w: 13, h: 13,
        }),
      ]),
      right: new Animation([
        new Sprite(this.texture, {
          x: 97, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 113, y: 1, w: 13, h: 13,
        }),
      ]),
      left: new Animation([
        new Sprite(this.texture, {
          x: 34, y: 1, w: 13, h: 13,
        }),
        new Sprite(this.texture, {
          x: 50, y: 1, w: 13, h: 13,
        }),
      ]),
    };
  }

  update({ input }) {
    if (input.isPressedLast(KeyboardInput.KEY_W)) {
      this.rotate('up');
    }
    if (input.isPressedLast(KeyboardInput.KEY_S)) {
      this.rotate('down');
    }
    if (input.isPressedLast(KeyboardInput.KEY_D)) {
      this.rotate('right');
    }
    if (input.isPressedLast(KeyboardInput.KEY_A)) {
      this.rotate('left');
    }

    const moveKeys = [
      KeyboardInput.KEY_W,
      KeyboardInput.KEY_A,
      KeyboardInput.KEY_S,
      KeyboardInput.KEY_D,
    ];
    if (input.isPressedAny(moveKeys)) {
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

    if (input.isPressed(KeyboardInput.KEY_SPACE)) {
      this.onFire();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  onFire() {}

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

export default Tank;
