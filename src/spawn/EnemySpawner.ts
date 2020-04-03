import { Subject, Timer, Vector } from '../core';
import { EnemyTank } from '../gameObjects';
import { MapConfig } from '../map';
import { TankFactory, TankType } from '../tank';
import * as config from '../config';

export interface EnemySpawnerSpawnedEvent {
  tank: EnemyTank;
  position: Vector;
}

export class EnemySpawner {
  public spawned = new Subject<EnemySpawnerSpawnedEvent>();
  private list: TankType[] = [];
  private listIndex = 0;
  private positions: Vector[] = [];
  private positionIndex = 0;
  private aliveTanks: EnemyTank[] = [];
  private timer = new Timer();

  constructor(mapConfig: MapConfig) {
    this.list = mapConfig.getEnemySpawnList();

    this.positions = mapConfig.getEnemySpawnPositions();

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
    const type = this.list[this.listIndex];

    const position = this.positions[this.positionIndex];

    const tank = TankFactory.createEnemy(type.tier, type.hasDrop);
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
}
