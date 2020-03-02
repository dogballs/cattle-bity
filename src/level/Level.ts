import {
  AudioLoader,
  GameObject,
  RandomUtils,
  Rotation,
  Subject,
  Timer,
} from '../core';
import { Session } from '../game';
import {
  Base,
  EnemyTank,
  Explosion,
  PlayerTank,
  Points,
  Spawn,
} from '../gameObjects';
import { MapConfig } from '../map';
import { PointsValue } from '../points';
import { PowerupFactory } from '../powerups';
import {
  EnemySpawner,
  EnemySpawnerSpawnedEvent,
  PlayerSpawner,
  PlayerSpawnerSpawnedEvent,
} from '../spawn';
import { TankDeathReason, TankTier } from '../tank';

import * as config from '../config';

enum State {
  Playing,
  PostWin,
  Won,
}

export class Level {
  public readonly enemySpawned = new Subject();
  public readonly won = new Subject();

  public readonly mapConfig: MapConfig;
  public readonly field: GameObject;
  public readonly base: Base;
  public playerTank: PlayerTank;

  private readonly audioLoader: AudioLoader;
  private readonly session: Session;

  private state = State.Playing;

  private enemySpawner: EnemySpawner;
  private playerSpawner: PlayerSpawner;

  private postWinTimer = new Timer(config.LEVEL_POST_WIN_DELAY);

  private powerupTimer = new Timer();
  private activePowerup: GameObject = null;

  constructor(
    mapConfig: MapConfig,
    field: GameObject,
    base: Base,
    audioLoader: AudioLoader,
    session: Session,
  ) {
    this.mapConfig = mapConfig;
    this.field = field;
    this.base = base;
    this.audioLoader = audioLoader;
    this.session = session;

    this.playerSpawner = new PlayerSpawner(mapConfig.spawn.player);
    this.playerSpawner.spawned.addListener(this.handlePlayerSpawned);

    this.enemySpawner = new EnemySpawner(mapConfig.spawn.enemy);
    this.enemySpawner.spawned.addListener(this.handleEnemySpawned);

    this.powerupTimer.done.addListener(this.handlePowerupTimer);

    this.postWinTimer.done.addListener(this.handlePostWinTimer);
  }

  public update(): void {
    if (this.state == State.Playing) {
      this.playerSpawner.update();
      this.enemySpawner.update();
      this.powerupTimer.tick();
      return;
    }

    // TODO: Player can kill base and pick powerups during this time
    if (this.state === State.PostWin) {
      this.postWinTimer.tick();
    }
  }

  public getUnspawnedEnemiesCount(): number {
    return this.enemySpawner.getUnspawnedCount();
  }

  private handlePowerupTimer = (): void => {
    // Remove powerup after timer expires
    if (this.activePowerup === null) {
      return;
    }
    this.activePowerup.removeSelf();
    this.activePowerup = null;
  };

  private handlePlayerSpawned = (event: PlayerSpawnerSpawnedEvent): void => {
    const { tank, position } = event;

    const spawn = new Spawn();
    spawn.position.copyFrom(position);
    spawn.completed.addListener(() => {
      tank.setCenterFrom(spawn);
      tank.died.addListener(() => {
        const explosion = new Explosion();
        explosion.setCenterFrom(tank);
        tank.replaceSelf(explosion);

        this.audioLoader.load('explosion.player').play();
      });
      tank.activateShield(config.SHIELD_SPAWN_DURATION);

      this.playerTank = tank;

      spawn.replaceSelf(tank);
    });
    this.field.add(spawn);
  };

  private handleEnemySpawned = (event: EnemySpawnerSpawnedEvent): void => {
    const { tank, position } = event;

    // When new tank with powerup spawns - remove active powerup
    if (tank.hasDrop && this.activePowerup !== null) {
      this.powerupTimer.stop();
      this.activePowerup.removeSelf();
      this.activePowerup = null;
    }

    // TODO: refactor this chain of subscriptions
    const spawn = new Spawn();
    spawn.position.copyFrom(position);
    spawn.completed.addListener(() => {
      tank.rotate(Rotation.Down);
      tank.setCenterFrom(spawn);
      tank.died.addListener((event) => {
        // TODO: grenade explosion explodes multiple enemies, should trigger
        // single audio
        this.audioLoader.load('explosion.enemy').play();

        if (tank.hasDrop) {
          this.spawnPowerup();
        }

        const explosion = new Explosion();
        explosion.setCenterFrom(tank);
        tank.replaceSelf(explosion);

        // Only player kills are awarded
        if (event.reason === TankDeathReason.Bullet) {
          explosion.done.addListenerOnce(() => {
            const points = this.createEnemyTankPoints(tank);
            points.setCenterFrom(tank);
            this.field.add(points);
          });
        }

        if (this.enemySpawner.areAllDead()) {
          this.state = State.PostWin;
        }

        this.session.addKillPoints(tank.type.tier);
      });
      spawn.replaceSelf(tank);
    });

    this.field.add(spawn);

    this.enemySpawned.notify();
  };

  private handlePostWinTimer = (): void => {
    this.state = State.Won;
    this.won.notify();
  };

  private spawnPowerup(): void {
    // Override previous powerup with newly picked up one
    if (this.activePowerup !== null) {
      this.powerupTimer.stop();
      this.activePowerup.removeSelf();
      this.activePowerup = null;
    }

    const powerup = PowerupFactory.createRandom();

    // TODO: Positioning should be smart
    // - on a road
    // - not spawn on top of base/tank/steel or water walls, etc
    const x = RandomUtils.number(0, config.FIELD_SIZE - powerup.size.width);
    const y = RandomUtils.number(0, config.FIELD_SIZE - powerup.size.height);

    powerup.position.set(x, y);

    powerup.picked.addListener(() => {
      powerup.action.execute(this.playerTank, powerup, this.base);

      const points = new Points(
        PointsValue.V500,
        config.POINTS_POWERUP_DURATION,
      );
      points.setCenterFrom(powerup);
      this.field.add(points);

      this.session.addPowerupPoints(powerup.type);
    });

    this.field.add(powerup);

    this.activePowerup = powerup;

    this.powerupTimer.reset(config.POWERUP_DURATION);

    this.audioLoader.load('powerup.spawn').play();
  }

  private createEnemyTankPoints(tank: EnemyTank): Points {
    const value = this.getEnemyTankPointsValue(tank);
    const points = new Points(value, config.POINTS_ENEMY_TANK_DURATION);
    return points;
  }

  private getEnemyTankPointsValue(tank: EnemyTank): PointsValue {
    switch (tank.type.tier) {
      case TankTier.A:
        return PointsValue.V100;
      case TankTier.B:
        return PointsValue.V200;
      case TankTier.C:
        return PointsValue.V300;
      case TankTier.D:
        return PointsValue.V400;
      default:
        return 0;
    }
  }
}
