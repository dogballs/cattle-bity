import { Animation, GameObject, Sprite, SpriteMaterial } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';

export class PauseNotification extends GameObject {
  public ignorePause = true;
  public material = new SpriteMaterial();
  private animation: Animation<Sprite>;

  constructor() {
    super(156, 28);

    this.animation = new Animation([SpriteFactory.asOne('ui.pause'), null], {
      delay: 13,
      loop: true,
    });
  }

  public update(): void {
    this.animation.animate();
    this.material.sprite = this.animation.getCurrentFrame();
  }

  public restart(): void {
    this.animation.restart();
  }
}
