import {
  CollisionDetector,
  GameLoop,
  GameObject,
  GameRenderer,
  GameState,
  KeyboardInput,
  KeyboardKey,
  Rect,
  State,
  Vector,
} from './core';

import { Base, Border, EnemyCounter, PauseNotification } from './gameObjects';

import * as config from './config';

import { DebugController, DebugGrid, DebugInspector } from './debug';
import { ConfigParser } from './ConfigParser';
import { Spawner } from './Spawner';

import { AudioManager } from './audio/AudioManager';
import { MapConfig, MapConfigSchema } from './map';
import { TerrainFactory } from './terrain';
import * as mapJSON from '../data/maps/stage1.json';

const gameRenderer = new GameRenderer({
  // debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});
document.body.appendChild(gameRenderer.domElement);

const input = new KeyboardInput();
input.listen();

const scene = new GameObject();

scene.add(new Border());

const field = new GameObject(config.FIELD_SIZE, config.FIELD_SIZE);
field.position.set(config.BORDER_LEFT_WIDTH, config.BORDER_TOP_BOTTOM_HEIGHT);
scene.add(field);

const mapConfig = ConfigParser.parse<MapConfig>(mapJSON, MapConfigSchema);

const terrainTiles = [];
mapConfig.terrain.regions.forEach((region) => {
  const regionRect = new Rect(region.x, region.y, region.width, region.height);
  const tiles = TerrainFactory.createFromRegion(region.type, regionRect);
  terrainTiles.push(...tiles);
});

field.add(...terrainTiles);

const base = new Base();
base.position.set(352, 736);
base.died.addListener(() => {
  console.log('Game over! Reason: Base');
});
field.add(base);

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
// scene.add(debugGrid);

const spawner = new Spawner(mapConfig, field, base);

const debug = new DebugController(spawner);

const debugInspector = new DebugInspector(gameRenderer.domElement);
debugInspector.listen();
debugInspector.click.addListener((position: Vector) => {
  const intersections: GameObject[] = [];

  scene.traverse((child) => {
    if (child.getWorldBoundingBox().contains(position)) {
      intersections.push(child);
    }
  });

  console.log(intersections);
});

const enemyCounter = new EnemyCounter(spawner.getUnspawnedEnemiesCount());
enemyCounter.position.set(
  config.BORDER_LEFT_WIDTH + config.FIELD_SIZE + 32,
  config.BORDER_TOP_BOTTOM_HEIGHT + 32,
);
scene.add(enemyCounter);

spawner.enemySpawned.addListener(() => {
  enemyCounter.updateCount(spawner.getUnspawnedEnemiesCount());
});

AudioManager.preloadAll();

const gameState = new State<GameState>(GameState.Playing);

const pauseAudio = AudioManager.load('pause');
const pauseNotification = new PauseNotification();
pauseNotification.setCenter(field.getChildrenCenter());
pauseNotification.position.y += 18;

const gameLoop = new GameLoop({
  onTick: (): void => {
    input.update();

    if (input.isDown(KeyboardKey.Enter)) {
      if (gameState.is(GameState.Playing)) {
        gameState.set(GameState.Paused);
        AudioManager.pauseAll();
        pauseAudio.play();
        pauseNotification.restart();
        field.add(pauseNotification);
      } else {
        gameState.set(GameState.Playing);
        AudioManager.resumeAll();
        field.remove(pauseNotification);
      }
    }

    // TODO: enemies with drops are still animated
    if (!gameState.is(GameState.Paused)) {
      spawner.update();
    }

    // Update all objects on the scene
    scene.traverse((child) => {
      const shouldUpdate = gameState.is(GameState.Playing) || child.ignorePause;
      if (shouldUpdate) {
        // TODO: abstract out input from tank
        child.update({ input, gameState });
      }
    });

    const nodes = scene.flatten();

    // Nodes that initiate collision
    const activeNodes = nodes.filter((node) => node.collider);

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(activeNodes, nodes);
    collisions.forEach((collision) => {
      collision.source.collide(collision.target);
    });

    gameRenderer.render(scene);

    gameState.tick();
  },
});

gameLoop.start();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.debug = debug;
