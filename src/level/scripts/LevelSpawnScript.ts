import { GameScript } from '../../game';
import { Spawn } from '../../gameObjects';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import {
  LevelEnemySpawnRequestedEvent,
  LevelPlayerSpawnRequestedEvent,
} from '../events';

export class LevelSpawnScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;

  constructor(world: LevelWorld, eventBus: LevelEventBus) {
    super();

    this.world = world;

    this.eventBus = eventBus;
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
