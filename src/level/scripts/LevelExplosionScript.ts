import { Explosion } from '../../gameObjects';

import { LevelScript } from '../LevelScript';
import { LevelEnemyDiedEvent, LevelPlayerDiedEvent } from '../events';

export class LevelExplosionScript extends LevelScript {
  protected setup(): void {
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
