import Animation from './../core/Animation';
import RenderableSprite from './../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class TankExplosion extends RenderableSprite {
  private animation: Animation;
  private dimensions: object;

  constructor() {
    super(124, 108);

    this.animation = new Animation(SpriteFactory.asList([
      'explosionTank.1',
      'explosionTank.2',
    ]), { delay: 100, loop: false });

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dimensions by centering sprite in box
    this.dimensions = [
      { width: 124, height: 108 },
      { width: 136, height: 128 },
    ];
  }

  // TODO: @mradionov rethink how to notify parent when animation is ended
  // eslint-disable-next-line class-methods-use-this
  public onComplete() {
    return undefined;
  }

  public update() {
    if (this.animation.isComplete()) {
      this.onComplete();
    } else {
      this.animation.animate();
    }
  }

  public render() {
    const sprite = this.animation.getCurrentFrame();
    const { frameIndex } = this.animation;

    const { width, height } = this.dimensions[frameIndex];

    return {
      height,
      sprite,
      width,
    };
  }
}

export default TankExplosion;
