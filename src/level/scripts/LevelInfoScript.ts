import { LevelInfo } from '../../gameObjects';
import * as config from '../../config';

import { LevelScript } from '../LevelScript';
import { LevelEnemySpawnRequestedEvent } from '../events';

export class LevelInfoScript extends LevelScript {
  private info: LevelInfo;

  protected setup(): void {
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.enemySpawnRequested.addListener(
      this.handleEnemySpawnRequested,
    );

    this.session.lifeup.addListener(this.handleSessionLifeup);

    this.info = new LevelInfo();
    this.info.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    this.world.sceneRoot.add(this.info);

    this.info.setLivesCount(this.session.getLivesCount());
    this.info.setLevelNumber(this.session.getLevelNumber());
  }

  private handlePlayerDied = (): void => {
    this.info.setLivesCount(this.session.getLivesCount());
  };

  private handleEnemySpawnRequested = (
    event: LevelEnemySpawnRequestedEvent,
  ): void => {
    this.info.setEnemyCount(event.unspawnedCount);
  };

  private handleSessionLifeup = (): void => {
    this.info.setLivesCount(this.session.getLivesCount());
  };
}
