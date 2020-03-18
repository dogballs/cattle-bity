import { Subject, Timer, Vector } from '../core';
import { PlayerTank } from '../gameObjects';
import { MapConfigSpawnLocation, MapConfigSpawnPlayer } from '../map';
import { TankFactory } from '../tank';
import * as config from '../config';

const DEFAULT_LOCATIONS: MapConfigSpawnLocation[] = [{ x: 256, y: 768 }];

export interface PlayerSpawnerSpawnedEvent {
  tank: PlayerTank;
  position: Vector;
}

export class PlayerSpawner {
  public spawned = new Subject();
  private position: Vector;
  private playerIndex: number;
  private timer = new Timer();

  constructor(spawnConfig: MapConfigSpawnPlayer, playerIndex = 0) {
    // Pick location for required player
    this.playerIndex = playerIndex;

    // Allow overriding spawn locations in map config
    let location = DEFAULT_LOCATIONS[playerIndex];
    if (spawnConfig.locations[playerIndex] !== undefined) {
      location = spawnConfig.locations[playerIndex];
    }

    this.position = new Vector(location.x, location.y);

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
