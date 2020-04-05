import { GameScript, Session } from '../../game';
import { LevelInfo } from '../../gameObjects';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import { LevelEnemySpawnRequestedEvent } from '../events';

export class LevelInfoScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private session: Session;
  private info: LevelInfo;

  constructor(world: LevelWorld, eventBus: LevelEventBus, session: Session) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
    this.eventBus.enemySpawnRequested.addListener(
      this.handleEnemySpawnRequested,
    );

    this.session = session;
  }

  protected setup(): void {
    this.info = new LevelInfo();
    this.info.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    this.world.sceneRoot.add(this.info);

    this.info.setLivesCount(this.session.getLivesCount());
  }

  private handlePlayerDied = (): void => {
    this.info.setLivesCount(this.session.getLivesCount());
  };

  private handleEnemySpawnRequested = (
    event: LevelEnemySpawnRequestedEvent,
  ): void => {
    this.info.setEnemyCount(event.unspawnedCount);
  };
}
