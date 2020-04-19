import { Spawn } from '../../gameObjects';

import { LevelScript } from '../LevelScript';
import {
  LevelEnemySpawnRequestedEvent,
  LevelPlayerSpawnRequestedEvent,
} from '../events';

export class LevelSpawnScript extends LevelScript {
  protected setup(): void {
    this.eventBus.enemySpawnRequested.addListener(
      this.handleEnemySpawnRequested,
    );
    this.eventBus.playerSpawnRequested.addListener(
      this.handlePlayerSpawnRequested,
    );
  }

  private handleEnemySpawnRequested = (
    event: LevelEnemySpawnRequestedEvent,
  ): void => {
    const spawn = new Spawn();
    spawn.position.copyFrom(event.position);
    spawn.updateMatrix();
    spawn.completed.addListenerOnce(() => {
      this.eventBus.enemySpawnCompleted.notify({
        type: event.type,
        centerPosition: spawn.getCenter(),
      });
      spawn.removeSelf();
    });
    this.world.field.add(spawn);
  };

  private handlePlayerSpawnRequested = (
    event: LevelPlayerSpawnRequestedEvent,
  ): void => {
    const spawn = new Spawn();
    spawn.position.copyFrom(event.position);
    spawn.updateMatrix();
    spawn.completed.addListenerOnce(() => {
      this.eventBus.playerSpawnCompleted.notify({
        type: event.type,
        centerPosition: spawn.getCenter(),
      });
      spawn.removeSelf();
    });
    this.world.field.add(spawn);
  };
}
