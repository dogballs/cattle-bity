import { GameScript } from '../../game';
import { Explosion } from '../../gameObjects';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import { LevelEnemyDiedEvent, LevelPlayerDiedEvent } from '../events';

export class LevelExplosionScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;

  constructor(world: LevelWorld, eventBus: LevelEventBus) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.playerDied.addListener(this.handlePlayerDied);
  }

  private handleEnemyDied = (event: LevelEnemyDiedEvent): void => {
    const explosion = new Explosion();
    explosion.setCenter(event.centerPosition);
    explosion.completed.addListener(() => {
      this.eventBus.enemyExploded.notify(event);
    });
    this.world.field.add(explosion);
  };

  private handlePlayerDied = (event: LevelPlayerDiedEvent): void => {
    const explosion = new Explosion();
    explosion.setCenter(event.centerPosition);
    this.world.field.add(explosion);
  };
}
