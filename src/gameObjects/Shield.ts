import { Animation, GameObject, Sprite, SpriteRenderer } from '../core';
import { GameObjectUpdateArgs, GameState } from '../game';

export class Shield extends GameObject {
  public ignorePause = true;
  public renderer = new SpriteRenderer();
  private animation: Animation<Sprite>;

  constructor() {
    super(64, 64);
  }

  protected setup({ spriteLoader }: GameObjectUpdateArgs): void {
    this.animation = new Animation(
      spriteLoader.loadList(['shield.1', 'shield.2']),
      { delay: 0.05, loop: true },
    );
  }

  protected update({ deltaTime, gameState }: GameObjectUpdateArgs): void {
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
    this.renderer.sprite = this.animation.getCurrentFrame();
  }
}
