import {
  AudioLoader,
  CollisionDetector,
  RandomUtils,
  Rect,
  Timer,
} from '../core';
import { LevelInputContext } from '../input';
import { GameObjectUpdateArgs, GameState, Rotation, Session } from '../game';
import {
  Base,
  Border,
  Curtain,
  EnemyTank,
  Explosion,
  LevelInfo,
  LevelTitle,
  Field,
  PauseNotice,
  PlayerTank,
  Points,
  Spawn,
} from '../gameObjects';
import { MapConfig } from '../map';
import { TerrainFactory } from '../terrain';
import { PointsRecord, PointsValue } from '../points';
import {
  EnemySpawner,
  EnemySpawnerSpawnedEvent,
  PlayerSpawner,
  PlayerSpawnerSpawnedEvent,
  PowerupSpawner,
  PowerupSpawnerSpawnedEvent,
} from '../spawn';
import { TankDeathReason, TankTier } from '../tank';

import * as config from '../config';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

enum State {
  Idle,
  Loading,
  Starting,
  Playing,
  Ending,
}

export class LevelScene extends Scene {
  private state = State.Idle;
  private audioLoader: AudioLoader;
  private curtain: Curtain;
  private title: LevelTitle;
  private session: Session;
  private startTimer = new Timer();
  private endTimer = new Timer();
  private enemySpawner: EnemySpawner;
  private playerSpawner: PlayerSpawner;
  private powerupSpawner: PowerupSpawner;
  private playerTank: PlayerTank;

  private info = new LevelInfo();
  private base = new Base();
  private field = new Field();
  private pauseNotice = new PauseNotice();
  private pointsRecord = new PointsRecord();

  protected setup({
    audioLoader,
    mapLoader,
    session,
  }: GameObjectUpdateArgs): void {
    this.audioLoader = audioLoader;
    this.session = session;

    this.state = State.Loading;
    mapLoader.loadAsync(session.getLevelNumber()).then(this.handleMapLoaded);

    // TODO: add them last order is important
    // TODO: curtain is displayed on top of scenes? (transition between levels)
    this.curtain = new Curtain(
      this.root.size.width,
      this.root.size.height,
      false,
    );
    this.root.add(this.curtain);

    this.title = new LevelTitle(session.getLevelNumber());
    this.title.setCenter(this.root.getSelfCenter());
    this.title.origin.set(0.5, 0.5);
    this.root.add(this.title);

    this.endTimer.done.addListener(this.handleEndTimer);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    if (this.state === State.Loading) {
      this.root.traverseDescedants((child) => {
        child.invokeUpdate(updateArgs);
      });
      return;
    }

    if (this.state === State.Starting) {
      if (this.startTimer.isDone()) {
        this.state = State.Playing;
      }
      this.startTimer.update(updateArgs.deltaTime);
      return;
    }

    const { gameState, input } = updateArgs;

    if (input.isDownAny(LevelInputContext.Pause)) {
      if (gameState.is(GameState.Playing)) {
        gameState.set(GameState.Paused);
        this.activatePause();
      } else {
        gameState.set(GameState.Playing);
        this.deactivatePause();
      }
    }

    // TODO: enemies with drops are still animated
    if (!gameState.is(GameState.Paused)) {
      this.playerSpawner.update(updateArgs.deltaTime);
      this.enemySpawner.update(updateArgs.deltaTime);
      this.powerupSpawner.update(updateArgs.deltaTime);
      this.endTimer.update(updateArgs.deltaTime);
    }

    // Update all objects on the scene
    this.root.traverseDescedants((child) => {
      const shouldUpdate = gameState.is(GameState.Playing) || child.ignorePause;
      if (shouldUpdate) {
        child.invokeUpdate(updateArgs);
      }
    });

    this.root.updateWorldMatrix(false, true);

    const nodes = this.root.flatten();

    // Nodes that initiate collision
    const activeNodes = nodes.filter((node) => node.collider);

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(activeNodes, nodes);
    collisions.forEach((collision) => {
      collision.source.invokeCollide(collision.target);
    });
  }

  private handleMapLoaded = (mapConfig: MapConfig): void => {
    this.root.add(new Border());

    this.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.root.add(this.field);

    this.base.position.set(352, 736);
    this.base.died.addListener(this.handleBaseDied);
    this.field.add(this.base);

    this.info.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    this.root.add(this.info);

    this.pauseNotice.setCenter(this.field.getSelfCenter());
    this.pauseNotice.position.y += 18;
    this.pauseNotice.visible = false;
    this.root.add(this.pauseNotice);

    const terrainTiles = [];
    mapConfig.terrain.regions.forEach((region) => {
      const regionRect = new Rect(
        region.x,
        region.y,
        region.width,
        region.height,
      );
      const tiles = TerrainFactory.createFromRegion(region.type, regionRect);
      terrainTiles.push(...tiles);
    });
    this.field.add(...terrainTiles);

    // this.title.visible = false;
    this.curtain.open();

    this.state = State.Starting;
    this.startTimer.reset(config.LEVEL_START_DELAY);

    this.playerSpawner = new PlayerSpawner(mapConfig.spawn.player);
    this.playerSpawner.spawned.addListener(this.handlePlayerSpawned);

    this.enemySpawner = new EnemySpawner(mapConfig.spawn.enemy);
    this.enemySpawner.spawned.addListener(this.handleEnemySpawned);

    this.powerupSpawner = new PowerupSpawner();
    this.powerupSpawner.spawned.addListener(this.handlePowerupSpawned);

    this.info.setEnemyCount(this.enemySpawner.getUnspawnedCount());

    this.info.setLivesCount(this.session.getLivesCount());
  };

  private activatePause(): void {
    this.audioLoader.pauseAll();
    this.audioLoader.load('pause').play();
    this.pauseNotice.visible = true;
    this.pauseNotice.restart();
    this.field.add(this.pauseNotice);
  }

  private deactivatePause(): void {
    this.audioLoader.resumeAll();
    this.pauseNotice.visible = false;
  }

  private handlePlayerSpawned = (event: PlayerSpawnerSpawnedEvent): void => {
    const { tank, position } = event;

    const spawn = new Spawn();
    spawn.position.copyFrom(position);
    spawn.completed.addListener(() => {
      tank.setCenter(spawn.getCenter());
      tank.died.addListener(() => {
        const explosion = new Explosion();
        explosion.setCenter(tank.getCenter());
        tank.replaceSelf(explosion);

        this.audioLoader.load('explosion.player').play();

        this.session.removeLive();
        if (this.session.isGameOver()) {
          this.playerSpawner.disable();
          this.end();
        } else {
          this.info.setLivesCount(this.session.getLivesCount());
        }
      });
      tank.activateShield(config.SHIELD_SPAWN_DURATION);

      this.playerTank = tank;

      spawn.replaceSelf(tank);
    });
    this.field.add(spawn);
  };

  private handleEnemySpawned = (event: EnemySpawnerSpawnedEvent): void => {
    const { tank, position } = event;

    if (tank.hasDrop) {
      this.powerupSpawner.unspawn();
    }

    // TODO: refactor this chain of subscriptions
    const spawn = new Spawn();
    spawn.position.copyFrom(position);
    spawn.completed.addListener(() => {
      tank.rotate(Rotation.Down);
      tank.setCenter(spawn.getCenter());
      tank.died.addListener((event) => {
        // TODO: grenade explosion explodes multiple enemies, should trigger
        // single audio
        this.audioLoader.load('explosion.enemy').play();

        if (tank.hasDrop) {
          this.powerupSpawner.spawn();
        }

        const explosion = new Explosion();
        explosion.setCenter(tank.getCenter());
        tank.replaceSelf(explosion);

        // Only player kills are awarded
        if (event.reason === TankDeathReason.Bullet) {
          explosion.done.addListenerOnce(() => {
            const points = this.createEnemyTankPoints(tank);
            points.setCenter(tank.getCenter());
            this.field.add(points);
          });
        }

        if (this.enemySpawner.areAllDead()) {
          this.end();
        }

        this.session.addKillPoints(tank.type.tier);
      });
      spawn.replaceSelf(tank);
    });

    this.field.add(spawn);

    this.info.setEnemyCount(this.enemySpawner.getUnspawnedCount());
  };

  private handlePowerupSpawned = (event: PowerupSpawnerSpawnedEvent): void => {
    const { powerup } = event;

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
      points.setCenter(powerup.getCenter());
      this.field.add(points);

      this.session.addPowerupPoints(powerup.type);
    });

    this.field.add(powerup);

    this.audioLoader.load('powerup.spawn').play();
  };

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

  private end(): void {
    this.state = State.Ending;
    this.endTimer.reset(config.LEVEL_END_DELAY);
  }

  private handleBaseDied = (): void => {
    this.session.setGameOver();
    this.end();
  };

  private handleEndTimer = (): void => {
    this.transition(SceneType.Score);
  };
}
