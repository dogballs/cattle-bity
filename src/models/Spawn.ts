import Animation from './../core/Animation';
import RenderableSprite from './../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class Spawn extends RenderableSprite {
  private animation: Animation;
  private dimensions: object;

  constructor() {
    super(36, 36);

    this.animation = new Animation(SpriteFactory.asList([
      'spawn.1',
      'spawn.2',
      'spawn.3',
      'spawn.4',
    ]), { delay: 40, loop: 3 });

    // Each sprite fragment has different size. Try to match it with
    // canvas size for different animation frames.
    // TODO: refactor dimensions by centering sprite in box
    this.dimensions = [
      { width: 36, height: 36 },
      { width: 44, height: 55 },
      { width: 52, height: 52 },
      { width: 60, height: 60 },
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

export default Spawn;
