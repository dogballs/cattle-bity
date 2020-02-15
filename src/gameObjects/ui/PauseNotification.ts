import { Animation, GameObject, Sprite, SpriteRenderer } from '../../core';
import { SpriteFactory } from '../../sprite/SpriteFactory';

export class PauseNotification extends GameObject {
  public ignorePause = true;
  public renderer = new SpriteRenderer();
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
    this.renderer.sprite = this.animation.getCurrentFrame();
  }

  public restart(): void {
    this.animation.reset();
  }
}
