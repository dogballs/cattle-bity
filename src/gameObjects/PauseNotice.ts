import { Animation, GameObject, Sprite, SpritePainter } from '../core';
import { GameUpdateArgs } from '../game';
import * as config from '../config';

export class PauseNotice extends GameObject {
  public zIndex = config.PAUSE_NOTICE_Z_INDEX;
  public ignorePause = true;
  public readonly painter = new SpritePainter();
  private animation: Animation<Sprite>;

  constructor() {
    super(156, 28);
  }

  public restart(): void {
    this.animation.reset();
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    // Null as a second frame adds a blink effect
    this.animation = new Animation([spriteLoader.load('ui.pause'), null], {
      delay: 0.27,
      loop: true,
    });
  }

  protected update(updateArgs: GameUpdateArgs): void {
    this.animation.update(updateArgs.deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
    this.setNeedsPaint();
  }
}
