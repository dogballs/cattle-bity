import Animation from '../core/Animation';
import KeyboardInput from '../core/KeyboardInput';
import RenderableSprite from '../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class Tank extends RenderableSprite {
  public bulletDamage: number;
  public bulletSpeed: number;
  private animations: object;
  private direction: string;
  private speed: number;

  constructor() {
    super(52, 52);

    this.speed = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.direction = 'up';

    this.animations = {
      down: new Animation(SpriteFactory.asList([
        'tankPlayer.down.1',
        'tankPlayer.down.2',
      ])),
      left: new Animation(SpriteFactory.asList([
        'tankPlayer.left.1',
        'tankPlayer.left.2',
      ])),
      right: new Animation(SpriteFactory.asList([
        'tankPlayer.right.1',
        'tankPlayer.right.2',
      ])),
      up: new Animation(SpriteFactory.asList([
        'tankPlayer.up.1',
        'tankPlayer.up.2',
      ])),
    };
  }

  public update({ input }) {
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
  public onFire() {
    return undefined;
  }

  public rotate(direction) {
    this.direction = direction;
  }

  public render() {
    const animation = this.animations[this.direction];
    const sprite = animation.getCurrentFrame();

    return {
      height: this.height,
      sprite,
      width: this.width,
    };
  }
}

export default Tank;
