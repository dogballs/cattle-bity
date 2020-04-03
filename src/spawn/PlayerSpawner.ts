import { Subject, Timer, Vector } from '../core';
import { PlayerTank } from '../gameObjects';
import { MapConfig } from '../map';
import { TankFactory } from '../tank';
import * as config from '../config';

export interface PlayerSpawnerSpawnedEvent {
  tank: PlayerTank;
  position: Vector;
}

export class PlayerSpawner {
  public spawned = new Subject();
  private position: Vector;
  private timer = new Timer();

  constructor(mapConfig: MapConfig, playerIndex = 0) {
    this.position = mapConfig.getPlayerSpawnPosition(playerIndex);

    this.timer.reset(config.PLAYER_FIRST_SPAWN_DELAY);
    this.timer.done.addListener(this.handleTimer);
  }

  public update(deltaTime: number): void {
    this.timer.update(deltaTime);
  }

  public disable(): void {
    this.timer.stop();
  }

  private handleTimer = (): void => {
    this.spawn();
  };

  private spawn(): void {
    const position = this.position;

    const tank = TankFactory.createPlayer();
    tank.died.addListener(() => {
      this.timer.reset(config.PLAYER_SPAWN_DELAY);
    });

    this.spawned.notify({ tank, position });
  }
}
