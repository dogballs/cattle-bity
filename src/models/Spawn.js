import Animation from './../core/Animation';
import RenderableSprite from './../core/RenderableSprite';
import Sprite from './../core/Sprite';
import Texture from './../core/Texture';

class Spawn extends RenderableSprite {
  constructor() {
    super(36, 36);

    this.texture = new Texture('images/sprite.png');

    this.animation = new Animation([
      new Sprite(this.texture, {
        x: 259, y: 99, w: 9, h: 9,
      }),
      new Sprite(this.texture, {
        x: 274, y: 98, w: 11, h: 11,
      }),
      new Sprite(this.texture, {
        x: 289, y: 97, w: 13, h: 13,
      }),
      new Sprite(this.texture, {
        x: 304, y: 96, w: 15, h: 15,
      }),
    ], { delay: 40, loop: 3 });

    this.dimensions = [
      { width: 36, height: 36 },
      { width: 44, height: 55 },
      { width: 52, height: 52 },
      { width: 60, height: 60 },
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
      sprite,
    };
  }
}

export default Spawn;
