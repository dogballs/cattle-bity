import Animation from '../core/Animation';
import RenderableSprite from '../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class Shield extends RenderableSprite {
  private animation: Animation;

  constructor() {
    super(64, 64);

    this.animation = new Animation(SpriteFactory.asList([
      'shield.1',
      'shield.2',
    ]), { delay: 50 });
  }

  public update() {
    this.animation.animate();
  }

  public render() {
    const sprite = this.animation.getCurrentFrame();

    return {
      height: this.height,
      sprite,
      width: this.width,
    };
  }
}

export default Shield;
