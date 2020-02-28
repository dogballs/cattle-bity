import {
  Alignment,
  Animation,
  GameObject,
  GameObjectUpdateArgs,
  Sprite,
  SpriteRenderer,
  Subject,
} from './../core';

export class Explosion extends GameObject {
  public readonly renderer = new SpriteRenderer();
  public readonly done = new Subject();
  private animation: Animation<Sprite>;

  constructor() {
    super(136, 136);

    this.renderer.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['explosion.large.1', 'explosion.large.2']),
      { delay: 4, loop: false },
    );
  }

  protected update(): void {
    if (this.animation.isComplete()) {
      this.removeSelf();
      this.done.notify();
      return;
    }
    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
