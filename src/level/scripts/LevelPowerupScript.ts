import { RandomUtils, Timer, Vector } from '../../core';
import { GameUpdateArgs, GameScript } from '../../game';
import { Powerup } from '../../gameObjects';
import { PowerupFactory } from '../../powerups';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import { LevelEnemyDiedEvent, LevelEnemySpawnCompletedEvent } from '../events';

export class LevelPowerupScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private timer: Timer;
  private activePowerup: Powerup = null;

  constructor(world: LevelWorld, eventBus: LevelEventBus) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.enemyDied.addListener(this.handleEnemyDied);
    this.eventBus.enemySpawnCompleted.addListener(
      this.handleEnemySpawnCompleted,
    );

    this.timer = new Timer();
    this.timer.done.addListener(this.handleTimer);
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
  }

  private handleEnemyDied = (event: LevelEnemyDiedEvent): void => {
    const { type: tankType } = event;

    // Ignore if tank does not have droppable powerup
    if (!tankType.hasDrop) {
      return;
    }

    // Override previous powerup with newly picked up one
    this.revoke();

    const powerup = PowerupFactory.createRandom();

    // TODO: Positioning should be smart
    // - on a road
    // - not spawn on top of base/tank/steel or water walls, etc
    const x = RandomUtils.number(0, config.FIELD_SIZE - 64);
    const y = RandomUtils.number(0, config.FIELD_SIZE - 64);

    const position = new Vector(x, y);

    powerup.position.copyFrom(position);

    powerup.picked.addListener(() => {
      this.eventBus.powerupPicked.notify({
        type: powerup.type,
        centerPosition: powerup.getCenter(),
      });
    });

    this.timer.reset(config.POWERUP_DURATION);

    this.activePowerup = powerup;

    this.world.field.add(powerup);

    this.eventBus.powerupSpawned.notify({
      type: powerup.type,
      position,
    });
  };

  // Remove active powerup whenever new enemy spawns with drop
  private handleEnemySpawnCompleted = (
    event: LevelEnemySpawnCompletedEvent,
  ): void => {
    const { type: tankType } = event;

    // Tanks without drops don't affect powerups
    if (!tankType.hasDrop) {
      return;
    }

    this.revoke();
  };

  // Remove powerup after timer expires
  private handleTimer = (): void => {
    this.revoke();
  };

  private revoke(): void {
    if (this.activePowerup === null) {
      return;
    }

    this.activePowerup.removeSelf();
    this.activePowerup = null;

    this.eventBus.powerupRevoked.notify(null);
  }
}
