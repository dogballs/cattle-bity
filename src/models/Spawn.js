import Animation from './../core/Animation.js';
import DisplayObject from './../core/DisplayObject.js';
import Sprite from './../core/Sprite.js';
import Texture from './../core/Texture.js';

class Spawn extends DisplayObject {
  constructor() {
    super(45, 45);

    this.texture = new Texture('images/sprite.png');

    this.animation = new Animation([
      new Sprite(this.texture, { x: 259, y: 99, w: 9, h: 9 }),
      new Sprite(this.texture, { x: 274, y: 98, w: 11, h: 11 }),
      new Sprite(this.texture, { x: 289, y: 97, w: 13, h: 13 }),
      new Sprite(this.texture, { x: 304, y: 96, w: 15, h: 15 }),
    ], { delay: 65, loop: 3 });

    this.dimensions = [
      { width: 45, height: 45 },
      { width: 55, height: 55 },
      { width: 65, height: 65 },
      { width: 75, height: 75 },
    ];
  }

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
    const frameIndex = this.animation.frameIndex;

    const { width, height } = this.dimensions[frameIndex];

    return {
      width: width,
      height: height,
      position: this.position,
      sprite,
    };
  }
}

export default Spawn;
