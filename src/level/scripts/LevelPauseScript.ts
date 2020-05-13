import { GameUpdateArgs, GameState } from '../../game';
import { PauseNotice } from '../../gameObjects';
import { LevelPlayInputContext } from '../../input';

import { LevelScript } from '../LevelScript';

export class LevelPauseScript extends LevelScript {
  private notice: PauseNotice;

  protected setup(): void {
    this.notice = new PauseNotice();
    this.notice.updateMatrix();
    this.notice.setCenter(this.world.field.getSelfCenter());
    this.notice.position.y += 18;
    this.notice.setVisible(false);
    this.world.field.add(this.notice);
  }

  protected update(updateArgs: GameUpdateArgs): void {
    const { gameState, inputManager, session } = updateArgs;

    const activeMethod = inputManager.getActiveMethod();

    // By default check single-player active input
    let inputMethods = [activeMethod];

    if (session.isMultiplayer()) {
      const playerSessions = session.getPlayers();

      // Get input variants for all players
      inputMethods = playerSessions.map((playerSession) => {
        const playerVariant = playerSession.getInputVariant();
        const playerMethod = inputManager.getMethodByVariant(playerVariant);
        return playerMethod;
      });
    }

    const anybodyPaused = inputMethods.some((inputMethod) => {
      return inputMethod.isDownAny(LevelPlayInputContext.Pause);
    });

    if (anybodyPaused) {
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
    this.notice.setVisible(true);
    this.notice.restart();

    this.eventBus.levelPaused.notify(null);
  }

  private deactivate(): void {
    this.notice.dirtyPaintBox();
    this.notice.setVisible(false);

    this.eventBus.levelUnpaused.notify(null);
  }
}
