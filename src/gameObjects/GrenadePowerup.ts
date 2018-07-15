import Animation from '../core/Animation';
import GameObject from '../core/GameObject';
import SpriteMaterial from '../core/SpriteMaterial';

import SpriteFactory from '../sprite/SpriteFactory';

class GrenadePowerup extends GameObject {
  private animation: Animation;

  constructor() {
    super(64, 60);

    // Null as a second frame adds a blink effect
    this.animation = new Animation([
      SpriteFactory.asOne('powerupGrenade'),
      null,
    ], { delay: 130 });

    this.material = new SpriteMaterial();
  }

  public update() {
    this.animation.animate();

    const sprite = this.animation.getCurrentFrame();
    this.material.sprite = sprite;
  }
}

export default GrenadePowerup;
