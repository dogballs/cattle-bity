import Animation from '../../canvas/Animation.js';
import Actor from '../base/Actor.js';
import Sprite from '../../source-managers/Sprite.js';
import TextureLoader from '../../source-managers/TextureLoader.js';

class BulletExplosion extends Actor {
  constructor() {
    super(55, 55);

    this.texture = new TextureLoader().load('images/sprite.png');

    this.animation = new Animation([
      new Sprite(this.texture, { x: 259, y: 130, w: 11, h: 11 }),
      new Sprite(this.texture, { x: 273, y: 129, w: 15, h: 15 }),
      new Sprite(this.texture, { x: 288, y: 128, w: 16, h: 16 }),
    ], { delay: 100, loop: false });

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    this.dimensions = [
      { width: 55, height: 55 },
      { width: 75, height: 75 },
      { width: 80, height: 80 },
    ];
  }

  update() {
    this.animation.animate();
  }

  isComplete() {
    return this.animation.isComplete();
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

export default BulletExplosion;
