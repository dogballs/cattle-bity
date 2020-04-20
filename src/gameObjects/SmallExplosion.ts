import {
  Animation,
  GameObject,
  Sprite,
  SpriteAlignment,
  SpritePainter,
  Subject,
} from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

export class SmallExplosion extends GameObject {
  public zIndex = config.SMALL_EXPLOSION_Z_INDEX;
  public readonly painter = new SpritePainter();
  public readonly done = new Subject();
  protected animation: Animation<Sprite>;

  constructor() {
    super(64, 64);

    this.painter.alignment = SpriteAlignment.MiddleCenter;
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
