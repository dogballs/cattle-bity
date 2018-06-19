import Animation from '../core/Animation';
import RenderableSprite from '../core/RenderableSprite';

import SpriteFactory from '../sprite/SpriteFactory';

class GrenadePowerup extends RenderableSprite {
  private animation: Animation;

  constructor() {
    super(64, 60);

    // Null as a second frame adds a blink effect
    this.animation = new Animation([
      SpriteFactory.asOne('powerupGrenade'),
      null,
    ], { delay: 130 });
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

export default GrenadePowerup;
