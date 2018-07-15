import Animation from '../core/Animation';
import GameObject from '../core/GameObject';
import KeyboardInput from '../core/KeyboardInput';
import SpriteMaterial from '../core/SpriteMaterial';

import SpriteFactory from '../sprite/SpriteFactory';

class Tank extends GameObject {
  public bulletDamage: number;
  public bulletSpeed: number;
  private animations: object;
  private speed: number;

  constructor() {
    super(52, 52);

    this.speed = 3;
    this.bulletDamage = 1;
    this.bulletSpeed = 10;

    this.animations = {
      [GameObject.Rotation.Up]: new Animation(SpriteFactory.asList([
        'tankPlayer.up.1',
        'tankPlayer.up.2',
      ])),
      [GameObject.Rotation.Down]: new Animation(SpriteFactory.asList([
        'tankPlayer.down.1',
        'tankPlayer.down.2',
      ])),
      [GameObject.Rotation.Right]: new Animation(SpriteFactory.asList([
        'tankPlayer.right.1',
        'tankPlayer.right.2',
      ])),
      [GameObject.Rotation.Left]: new Animation(SpriteFactory.asList([
        'tankPlayer.left.1',
        'tankPlayer.left.2',
      ])),
    };

    this.material = new SpriteMaterial();
  }

  public update({ input }) {
    if (input.isPressedLast(KeyboardInput.KEY_W)) {
      this.rotate(GameObject.Rotation.Up);
    }
    if (input.isPressedLast(KeyboardInput.KEY_S)) {
      this.rotate(GameObject.Rotation.Down);
    }
    if (input.isPressedLast(KeyboardInput.KEY_A)) {
      this.rotate(GameObject.Rotation.Left);
    }
    if (input.isPressedLast(KeyboardInput.KEY_D)) {
      this.rotate(GameObject.Rotation.Right);
    }

    const moveKeys = [
      KeyboardInput.KEY_W,
      KeyboardInput.KEY_A,
      KeyboardInput.KEY_S,
      KeyboardInput.KEY_D,
    ];
    if (input.isPressedAny(moveKeys)) {
      if (this.rotation === GameObject.Rotation.Up) {
        this.position.y -= this.speed;
      } else if (this.rotation === GameObject.Rotation.Down) {
        this.position.y += this.speed;
      } else if (this.rotation === GameObject.Rotation.Right) {
        this.position.x += this.speed;
      } else if (this.rotation === GameObject.Rotation.Left) {
        this.position.x -= this.speed;
      }
    }

    const animation = this.animations[this.rotation];
    if (input.isPressedAny(moveKeys)) {
      animation.animate();
    }

    if (input.isPressed(KeyboardInput.KEY_SPACE)) {
      this.onFire();
    }

    const sprite = animation.getCurrentFrame();

    this.material.sprite = sprite;
  }

  // eslint-disable-next-line class-methods-use-this
  public onFire() {
    return undefined;
  }
}

export default Tank;
