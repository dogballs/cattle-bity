import {
  Alignment,
  Animation,
  GameObject,
  Sprite,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs } from '../game';

export class SmallExplosion extends GameObject {
  public readonly painter = new SpritePainter();
  public readonly done = new Subject();
  protected animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.painter.alignment = Alignment.MiddleCenter;
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList([
        'explosion.small.1',
        'explosion.small.2',
        'explosion.small.3',
      ]),
      { delay: 0.05, loop: false },
    );
  }

  protected update(updateArgs: GameUpdateArgs): void {
    if (this.animation.isComplete()) {
      this.removeSelf();
      this.done.notify(null);
      return;
    }

    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
