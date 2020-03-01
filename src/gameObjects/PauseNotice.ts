import { Animation, GameObject, Sprite, SpriteRenderer } from '../core';
import { GameObjectUpdateArgs } from '../game';

export class PauseNotice extends GameObject {
  public ignorePause = true;
  public readonly renderer = new SpriteRenderer();
  private animation: Animation<Sprite>;

  constructor() {
    super(156, 28);
  }

  public restart(): void {
    this.animation.reset();
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    // Null as a second frame adds a blink effect
    this.animation = new Animation([spriteLoader.load('ui.pause'), null], {
      delay: 16,
      loop: true,
    });
  }

  protected update(): void {
    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
