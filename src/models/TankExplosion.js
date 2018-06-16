import Animation from './../core/Animation';
import DisplayObject from './../core/DisplayObject';
import Sprite from './../core/Sprite';
import Texture from './../core/Texture';

class TankExplosion extends DisplayObject {
  constructor() {
    super(124, 108);

    this.texture = new Texture('images/sprite.png');

    this.animation = new Animation([
      new Sprite(this.texture, {
        x: 304, y: 129, w: 31, h: 29,
      }),
      new Sprite(this.texture, {
        x: 334, y: 128, w: 34, h: 32,
      }),
    ], { delay: 100, loop: false });

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    this.dimensions = [
      { width: 124, height: 108 },
      { width: 136, height: 128 },
    ];
  }

  // TODO: @mradionov rethink how to notify parent when animation is ended
  // eslint-disable-next-line class-methods-use-this
  onComplete() {}

  update() {
    if (this.animation.isComplete()) {
      this.onComplete();
    } else {
      this.animation.animate();
    }
  }

  render() {
    const sprite = this.animation.getCurrentFrame();
    const { frameIndex } = this.animation;

    const { width, height } = this.dimensions[frameIndex];

    return {
      width,
      height,
      position: this.position,
      sprite,
    };
  }
}

export default TankExplosion;
