import { Timer, Vector } from '../../core';
import { GameScript, GameUpdateArgs, Rotation } from '../../game';
import { EnemyTank } from '../../gameObjects';
import { MapConfig } from '../../map';
import { PowerupType } from '../../powerups';
import { TankDeathReason, TankFactory, TankParty, TankType } from '../../tank';
import * as config from '../../config';

import { LevelEventBus } from '../LevelEventBus';
import { LevelWorld } from '../LevelWorld';
import {
  LevelEnemySpawnCompletedEvent,
  LevelPowerupPickedEvent,
} from '../events';

export class LevelEnemyScript extends GameScript {
  private world: LevelWorld;
  private eventBus: LevelEventBus;
  private list: TankType[] = [];
  private listIndex = 0;
  private aliveTanks: EnemyTank[] = [];
  private positions: Vector[] = [];
  private positionIndex = 0;
  private timer = new Timer();

  constructor(
    world: LevelWorld,
    eventBus: LevelEventBus,
    mapConfig: MapConfig,
  ) {
    super();

    this.world = world;

    this.eventBus = eventBus;
    this.eventBus.enemySpawnCompleted.addListener(this.handleSpawnCompleted);
    this.eventBus.powerupPicked.addListener(this.handlePowerupPicked);

    this.list = mapConfig.getEnemySpawnList();

    this.positions = mapConfig.getEnemySpawnPositions();

    this.timer.reset(config.ENEMY_FIRST_SPAWN_DELAY);
    this.timer.done.addListener(this.handleTimer);
  }

  protected update({ deltaTime }: GameUpdateArgs): void {
    this.timer.update(deltaTime);
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

    this.requestSpawn();

    // Start timer to spawn next enemy
    this.timer.reset(config.ENEMY_SPAWN_DELAY);
  };

  private handleSpawnCompleted = (
    event: LevelEnemySpawnCompletedEvent,
  ): void => {
    const { type } = event;

    if (type.party !== TankParty.Enemy) {
      return;
    }

    const tank = TankFactory.createEnemy(type.tier, type.hasDrop);
    tank.rotate(Rotation.Down);
    tank.setCenter(event.centerPosition);

    tank.hit.addListener(() => {
      this.eventBus.enemyHit.notify({
        type,
      });
    });

    tank.died.addListener((deathEvent) => {
      this.eventBus.enemyDied.notify({
        type,
        centerPosition: tank.getCenter(),
        reason: deathEvent.reason,
      });

      tank.removeSelf();

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

    this.world.field.add(tank);
  };

  private requestSpawn(): void {
    const type = this.list[this.listIndex];
    const position = this.positions[this.positionIndex];

    // Go to next tank
    this.listIndex += 1;

    // Take turns for positions where to spawn tanks
    this.positionIndex += 1;
    if (this.positionIndex >= this.positions.length) {
      this.positionIndex = 0;
    }

    const unspawnedCount = this.getUnspawnedCount();

    this.eventBus.enemySpawnRequested.notify({
      type,
      position,
      unspawnedCount,
    });
  }

  private getUnspawnedCount(): number {
    return this.list.length - this.listIndex;
  }

  private areAllDead(): boolean {
    const unspawnedCount = this.getUnspawnedCount();
    const aliveCount = this.aliveTanks.length;

    const areAllDead = unspawnedCount === 0 && aliveCount === 0;

    return areAllDead;
  }

  private handlePowerupPicked = (event: LevelPowerupPickedEvent): void => {
    const { type: powerupType } = event;

    if (powerupType === PowerupType.Wipeout) {
      this.aliveTanks.forEach((tank) => {
        // Enemy with drop cant drop it when killed by powerup
        tank.discardDrop();

        // Pass death reason because picking up this powerup does not award
        // per-enemy points. Only powerup pickup points are awarded.
        tank.die(TankDeathReason.WipeoutPowerup);
      });
    }
  };
}
