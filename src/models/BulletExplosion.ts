import Animation from './../core/Animation';
import RenderableSprite from './../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class BulletExplosion extends RenderableSprite {
  private animation: Animation;
  private dimensions: object;

  constructor() {
    super(44, 44);

    this.animation = new Animation(SpriteFactory.asList([
      'explosionBullet.1',
      'explosionBullet.2',
      'explosionBullet.3',
    ]), { delay: 50, loop: false });

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dimensions by centering sprite in box
    this.dimensions = [
      { width: 44, height: 44 },
      { width: 60, height: 60 },
      { width: 64, height: 64 },
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

export default BulletExplosion;
