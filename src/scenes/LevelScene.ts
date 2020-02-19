import {
  CollisionDetector,
  GameObject,
  GameState,
  KeyboardKey,
  Rect,
} from '../core';
import { Base, Border, EnemyCounter, PauseNotice } from '../gameObjects';
import { DebugGrid } from '../debug';
import { MapConfig, MapConfigSchema } from '../map';
import { TerrainFactory } from '../terrain';
import { AudioManager } from '../audio/AudioManager';
import { ConfigParser } from '../ConfigParser';
import { Spawner } from '../Spawner';
import * as config from '../config';

import * as mapJSON from '../../data/maps/stage1.json';

import { Scene, SceneUpdateArgs } from './Scene';

export class LevelScene extends Scene {
  private field: GameObject;
  private base: Base;
  private spawner: Spawner;
  private enemyCounter: EnemyCounter;
  private pauseNotice: PauseNotice;

  public setup(): void {
    const mapConfig = ConfigParser.parse<MapConfig>(mapJSON, MapConfigSchema);

    this.root.add(new Border());

    this.field = this.createField();
    this.root.add(this.field);

    this.base = this.createBase();
    this.field.add(this.base);

    this.spawner = new Spawner(mapConfig, this.field, this.base);
    this.spawner.enemySpawned.addListener(this.handleEnemySpawned);

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

    this.enemyCounter = this.createEnemyCounter();
    this.enemyCounter.updateCount(this.spawner.getUnspawnedEnemiesCount());
    this.root.add(this.enemyCounter);

    this.pauseNotice = this.createPauseNotice(this.field);
  }

  public update(updateArgs: SceneUpdateArgs): void {
    const { gameState, input } = updateArgs;

    if (input.isDown(KeyboardKey.Enter)) {
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
      this.spawner.update();
    }

    // Update all objects on the scene
    this.root.traverse((child) => {
      const shouldUpdate = gameState.is(GameState.Playing) || child.ignorePause;
      if (shouldUpdate) {
        // TODO: abstract out input from tank
        child.update({ input, gameState });
      }
    });

    const nodes = this.root.flatten();

    // Nodes that initiate collision
    const activeNodes = nodes.filter((node) => node.collider);

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(activeNodes, nodes);
    collisions.forEach((collision) => {
      collision.source.collide(collision.target);
    });
  }

  private activatePause(): void {
    AudioManager.pauseAll();
    AudioManager.load('pause').play();
    this.pauseNotice.restart();
    this.field.add(this.pauseNotice);
  }

  private deactivatePause(): void {
    AudioManager.resumeAll();
    this.field.remove(this.pauseNotice);
  }

  private handleBaseDied = (): void => {
    console.log('Game over! Reason: Base');
  };

  private handleEnemySpawned = (): void => {
    this.enemyCounter.updateCount(this.spawner.getUnspawnedEnemiesCount());
  };

  private createField(): GameObject {
    const field = new GameObject(config.FIELD_SIZE, config.FIELD_SIZE);
    field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    return field;
  }

  private createBase(): Base {
    const base = new Base();
    base.position.set(352, 736);
    base.died.addListener(this.handleBaseDied);
    return base;
  }

  private createEnemyCounter(): EnemyCounter {
    const enemyCounter = new EnemyCounter();
    enemyCounter.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    return enemyCounter;
  }

  private createPauseNotice(field: GameObject): PauseNotice {
    const pauseNotice = new PauseNotice();
    pauseNotice.setCenter(field.getChildrenCenter());
    pauseNotice.position.y += 18;
    return pauseNotice;
  }

  private createDebugGrid(): DebugGrid {
    const debugGrid = new DebugGrid(
      config.FIELD_SIZE,
      config.FIELD_SIZE,
      config.TILE_SIZE_SMALL,
      'rgba(255,255,255,0.3)',
    );
    debugGrid.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );
    return debugGrid;
  }
}