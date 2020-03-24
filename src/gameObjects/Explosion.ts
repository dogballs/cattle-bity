import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from './../core';
import { GameObjectUpdateArgs } from '../game';

export class Explosion extends GameObject {
  public readonly painter = new SpritePainter();
  public readonly done = new Subject();
  private animation: Animation<Sprite>;

  constructor() {
    super(136, 136);

    this.painter.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['explosion.large.1', 'explosion.large.2']),
      { delay: 0.066, loop: false },
    );
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    if (this.animation.isComplete()) {
      this.removeSelf();
      this.done.notify();
      return;
    }
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
