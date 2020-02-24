import {
  Alignment,
  Animation,
  GameObject,
  GameObjectUpdateArgs,
  Rect,
  Sprite,
  SpriteRenderer,
  Subject,
} from '../core';

export class Spawn extends GameObject {
  public renderer = new SpriteRenderer();
  public completed = new Subject();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.renderer.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      [
        spriteLoader.load('spawn.1', new Rect(0, 0, 36, 36)),
        spriteLoader.load('spawn.2', new Rect(0, 0, 44, 44)),
        spriteLoader.load('spawn.3', new Rect(0, 0, 52, 52)),
        spriteLoader.load('spawn.4', new Rect(0, 0, 60, 60)),
      ],
      { delay: 3, loop: 3 },
    );
  }

  protected update(): void {
    if (this.animation.isComplete()) {
      this.completed.notify();
      return;
    }

    this.animation.animate();
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
