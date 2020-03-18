import { Subject, Timer } from '../core';
import { Powerup } from '../gameObjects';
import { PowerupFactory } from '../powerups';
import * as config from '../config';

export interface PowerupSpawnerSpawnedEvent {
  powerup: Powerup;
}

export class PowerupSpawner {
  public spawned = new Subject();
  private timer = new Timer();
  private activePowerup: Powerup = null;

  constructor() {
    this.timer.done.addListener(this.handleTimer);
  }

  public update(deltaTime: number): void {
    this.timer.update(deltaTime);
  }

  public spawn(): void {
    // Override previous powerup with newly picked up one
    if (this.activePowerup !== null) {
      this.timer.stop();
      this.activePowerup.removeSelf();
      this.activePowerup = null;
    }

    const powerup = PowerupFactory.createRandom();

    this.activePowerup = powerup;

    this.timer.reset(config.POWERUP_DURATION);

    this.spawned.notify({ powerup });
  }

  public unspawn(): void {
    if (this.activePowerup === null) {
      return;
    }
    this.timer.stop();
    this.activePowerup.removeSelf();
    this.activePowerup = null;
  }

  private handleTimer = (): void => {
    if (this.activePowerup === null) {
      return;
    }
    // Remove powerup after timer expires
    this.activePowerup.removeSelf();
    this.activePowerup = null;
  };
}
