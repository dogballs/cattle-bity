import { Subject, Timer, Vector } from '../core';
import { EnemyTank } from '../gameObjects';
import {
  MapConfigSpawnEnemy,
  MapConfigSpawnEnemyListItem,
  MapConfigSpawnLocation,
} from '../map';
import { TankFactory } from '../tank';
import * as config from '../config';

const DEFAULT_LOCATIONS: MapConfigSpawnLocation[] = [
  { x: 384, y: 0 },
  { x: 768, y: 0 },
  { x: 0, y: 0 },
];

export interface EnemySpawnerSpawnedEvent {
  tank: EnemyTank;
  position: Vector;
}

export class EnemySpawner {
  public spawned = new Subject<EnemySpawnerSpawnedEvent>();
  private list: MapConfigSpawnEnemyListItem[] = [];
  private listIndex = 0;
  private positions: Vector[] = [];
  private positionIndex = 0;
  private aliveTanks: EnemyTank[] = [];
  private timer = new Timer();

  constructor(spawnConfig: MapConfigSpawnEnemy) {
    this.list = spawnConfig.list.slice(0, config.ENEMY_MAX_TOTAL_COUNT);

    // Allow overriding spawn locations in map config
    let locations = DEFAULT_LOCATIONS;
    if (spawnConfig.locations.length > 0) {
      locations = spawnConfig.locations;
    }

    this.positions = this.getLocationPositions(locations);

    this.timer.reset(config.ENEMY_FIRST_SPAWN_DELAY);
    this.timer.done.addListener(this.handleTimer);
  }

  public update(deltaTime: number): void {
    this.timer.update(deltaTime);
  }

  public getUnspawnedCount(): number {
    return this.list.length - this.listIndex;
  }

  public areAllDead(): boolean {
    const unspawnedCount = this.getUnspawnedCount();
    const aliveCount = this.aliveTanks.length;

    const areAllDead = unspawnedCount === 0 && aliveCount === 0;

    return areAllDead;
  }

  private handleTimer = (): void => {
    // Happens after max enemies spawn
    if (this.aliveTanks.length >= config.ENEMY_MAX_ALIVE_COUNT) {
      this.timer.stop();
      return;
    }

    // No more tanks to spawn
    if (this.listIndex >= this.list.length) {
      this.timer.stop();
      return;
    }

    this.spawn();

    // Start timer to spawn next enemy
    this.timer.reset(config.ENEMY_SPAWN_DELAY);
  };

  private spawn(): void {
    const enemyConfig = this.list[this.listIndex];
    const { drop: hasDrop, tier } = enemyConfig;

    const position = this.positions[this.positionIndex];

    const tank = TankFactory.createEnemy(tier, hasDrop);
    tank.died.addListener(() => {
      // Remove from alive
      this.aliveTanks = this.aliveTanks.filter((aliveTank) => {
        return aliveTank !== tank;
      });

      // If timer was stopped because max count of alive enemies has been
      // reached, restart it, because one of alive tanks has just been killed
      if (!this.timer.isActive()) {
        this.timer.reset(config.ENEMY_SPAWN_DELAY);
      }
    });

    this.aliveTanks.push(tank);

    // Go to next tank
    this.listIndex += 1;

    // Take turns for positions where to spawn tanks
    this.positionIndex += 1;
    if (this.positionIndex >= this.positions.length) {
      this.positionIndex = 0;
    }

    this.spawned.notify({ tank, position });
  }

  private getLocationPositions(locations: MapConfigSpawnLocation[]): Vector[] {
    return locations.map((location) => {
      return new Vector(location.x, location.y);
    });
  }
}
