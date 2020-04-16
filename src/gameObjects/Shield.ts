import { Animation, GameObject, Sprite, SpritePainter } from '../core';
import { GameUpdateArgs, GameState } from '../game';
import * as config from '../config';

export class Shield extends GameObject {
  public ignorePause = true;
  public zIndex = config.SHIELD_Z_INDEX;
  public painter = new SpritePainter();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);
  }

  protected setup({ spriteLoader }: GameUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['shield.1', 'shield.2']),
      { delay: 0.05, loop: true },
    );
  }

  protected update({ deltaTime, gameState }: GameUpdateArgs): void {
    // Shield is not displayed during a pause
    if (gameState.hasChangedTo(GameState.Paused)) {
      this.visible = false;
    }
    if (gameState.hasChangedTo(GameState.Playing)) {
      this.visible = true;
    }
    if (gameState.is(GameState.Paused)) {
      return;
    }

    this.animation.update(deltaTime);
    this.painter.sprite = this.animation.getCurrentFrame();
  }
}
