import {
  Alignment,
  Animation,
  GameObject,
  GameObjectUpdateArgs,
  Rect,
  Sprite,
  SpriteRenderer,
  Subject,
} from './../core';

export class SmallExplosion extends GameObject {
  public readonly renderer = new SpriteRenderer();
  public readonly done = new Subject();
  protected animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.renderer.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      [
        spriteLoader.load('explosion.small.1', new Rect(0, 0, 44, 44)),
        spriteLoader.load('explosion.small.2', new Rect(0, 0, 60, 60)),
        spriteLoader.load('explosion.small.3', new Rect(0, 0, 64, 64)),
      ],
      { delay: 3, loop: false },
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
