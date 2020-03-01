import { AudioLoader, CollisionDetector, Rect } from '../core';
import { GameObjectUpdateArgs, GameState } from '../game';
import { InputControl } from '../input';
import {
  Border,
  Curtain,
  LevelInfo,
  LevelTitle,
  Field,
  PauseNotice,
} from '../gameObjects';
import { MapConfig } from '../map';
import { TerrainFactory } from '../terrain';
import { Level } from '../level';
import * as config from '../config';

import { Scene } from './Scene';
import { SceneType } from './SceneType';

enum State {
  Idle,
  Loading,
  Playing,
}

export class LevelScene extends Scene {
  private state = State.Idle;
  private audioLoader: AudioLoader;
  private curtain: Curtain;
  private title: LevelTitle;
  private info = new LevelInfo();
  private field = new Field();
  private pauseNotice = new PauseNotice();
  private level: Level;

  protected setup({
    audioLoader,
    mapLoader,
    session,
  }: GameObjectUpdateArgs): void {
    this.audioLoader = audioLoader;

    this.state = State.Loading;
    mapLoader.loadAsync(session.levelNumber).then(this.handleMapLoaded);

    // TODO: add them last order is important
    this.curtain = new Curtain(
      this.root.size.width,
      this.root.size.height,
      false,
    );
    this.root.add(this.curtain);

    this.title = new LevelTitle(session.levelNumber);
    this.title.setCenter(this.root.getChildrenCenter());
    this.title.pivot.set(0.5, 0.5);
    this.root.add(this.title);
  }

  protected update(updateArgs: GameObjectUpdateArgs): void {
    if (this.state !== State.Playing) {
      this.root.traverseDescedants((child) => {
        child.invokeUpdate(updateArgs);
      });
      return;
    }

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

  private handleMapLoaded = (mapConfig: MapConfig): void => {
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

    this.pauseNotice.setCenter(this.field.getChildrenCenter());
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
    this.level = new Level(
      mapConfig,
      this.field,
      this.field.base,
      this.audioLoader,
    );

    this.level.enemySpawned.addListener(this.handleEnemySpawned);
    this.info.setEnemyCount(this.level.getUnspawnedEnemiesCount());
    this.field.base.died.addListener(this.handleBaseDied);

    this.title.visible = false;
    this.curtain.open();

    this.state = State.Playing;
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

  private handleBaseDied = (): void => {
    console.log('Game over! Reason: Base');
    this.transition(SceneType.Score);
  };

  private handleEnemySpawned = (): void => {
    this.info.setEnemyCount(this.level.getUnspawnedEnemiesCount());
  };
}
