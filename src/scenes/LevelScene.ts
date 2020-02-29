import {
  AudioLoader,
  CollisionDetector,
  GameObjectUpdateArgs,
  GameState,
  Rect,
} from '../core';
import { InputControl } from '../input';
import { Border, LevelInfo, Field, PauseNotice } from '../gameObjects';
import { MapConfig, MapConfigSchema } from '../map';
import { TerrainFactory } from '../terrain';
import { ConfigParser } from '../ConfigParser';
import { Level } from '../level';
import * as config from '../config';

import * as mapJSON from '../../data/maps/original/01.json';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

export class LevelScene extends Scene {
  private audioLoader: AudioLoader;
  private info = new LevelInfo();
  private field = new Field();
  private pauseNotice = new PauseNotice();
  private level: Level;

  protected setup({ audioLoader }: GameObjectUpdateArgs): void {
    this.audioLoader = audioLoader;

    this.root.add(new Border());

    this.root.add(this.field);
    this.field.position.set(
      config.BORDER_LEFT_WIDTH,
      config.BORDER_TOP_BOTTOM_HEIGHT,
    );

    this.info.position.set(
      config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
      config.BORDER_TOP_BOTTOM_HEIGHT + 32,
    );
    this.root.add(this.info);

    const mapConfig = ConfigParser.parse<MapConfig>(mapJSON, MapConfigSchema);
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

    this.level = new Level(
      mapConfig,
      this.field,
      this.field.base,
      this.audioLoader,
    );
    this.level.enemySpawned.addListener(this.handleEnemySpawned);

    this.info.setEnemyCount(this.level.getUnspawnedEnemiesCount());

    this.pauseNotice.setCenter(this.field.getChildrenCenter());
    this.pauseNotice.position.y += 18;
    this.pauseNotice.visible = false;
    this.root.add(this.pauseNotice);

    this.field.base.died.addListener(this.handleBaseDied);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    const { gameState, input } = updateArgs;

    if (input.isDown(InputControl.Start)) {
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
      this.level.update();
    }

    // Update all objects on the scene
    this.root.traverseDescedants((child) => {
      const shouldUpdate = gameState.is(GameState.Playing) || child.ignorePause;
      if (shouldUpdate) {
        // TODO: abstract out input from tank
        child.invokeUpdate(updateArgs);
      }
    });

    const nodes = this.root.flatten();

    // Nodes that initiate collision
    const activeNodes = nodes.filter((node) => node.collider);

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(activeNodes, nodes);
    collisions.forEach((collision) => {
      collision.source.invokeCollide(collision.target);
    });
  }

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

  private handleBaseDied = (): void => {
    console.log('Game over! Reason: Base');
    this.transition(SceneType.Score);
  };

  private handleEnemySpawned = (): void => {
    this.info.setEnemyCount(this.level.getUnspawnedEnemiesCount());
  };
}
