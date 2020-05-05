import { LevelInfo } from '../../gameObjects';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import { LevelEnemySpawnRequestedEvent, LevelPlayerDiedEvent } from '../events';

export class LevelInfoScript extends LevelScript {
  private info: LevelInfo;

  protected setup(): void {
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.enemySpawnRequested.addListener(
      this.handleEnemySpawnRequested,
    );

    this.info = new LevelInfo();
    this.info.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    this.world.sceneRoot.add(this.info);

    this.info.setLevelNumber(this.session.getLevelNumber());

    this.session.players.forEach((playerSession, playerIndex) => {
      playerSession.lifeup.addListener(() => {
        this.info.setLivesCount(playerIndex, playerSession.getLivesCount());
      });

      this.info.setLivesCount(playerIndex, playerSession.getLivesCount());
    });
  }

  private handlePlayerDied = (event: LevelPlayerDiedEvent): void => {
    const playerSession = this.session.getPlayer(event.playerIndex);

    this.info.setLivesCount(event.playerIndex, playerSession.getLivesCount());
  };

  private handleEnemySpawnRequested = (
    event: LevelEnemySpawnRequestedEvent,
  ): void => {
    this.info.setEnemyCount(event.unspawnedCount);
  };
}
