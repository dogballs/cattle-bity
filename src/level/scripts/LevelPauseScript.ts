import { GameUpdateArgs, GameState } from '../../game';
import { PauseNotice } from '../../gameObjects';
import { LevelInputContext } from '../../input';

import { LevelScript } from '../LevelScript';

export class LevelPauseScript extends LevelScript {
  private notice: PauseNotice;

  protected setup(): void {
    this.notice = new PauseNotice();
    this.notice.setCenter(this.world.field.getSelfCenter());
    this.notice.position.y += 18;
    this.notice.visible = false;
    this.world.field.add(this.notice);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState, input } = updateArgs;

    if (input.isDownAny(LevelInputContext.Pause)) {
      if (gameState.is(GameState.Playing)) {
        gameState.set(GameState.Paused);
        this.activate();
      } else {
        gameState.set(GameState.Playing);
        this.deactivate();
      }
    }
  }

  private activate(): void {
    this.notice.visible = true;
    this.notice.restart();

    this.eventBus.levelPaused.notify(null);
  }

  private deactivate(): void {
    this.notice.visible = false;

    this.eventBus.levelUnpaused.notify(null);
  }
}
