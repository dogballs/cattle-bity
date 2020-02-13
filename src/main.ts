import {
  CollisionDetector,
  GameLoop,
  GameObject,
  GameState,
  KeyboardInput,
  KeyboardKey,
  Renderer,
  State,
} from './core';

import { Base, Border, EnemyCounter, PauseNotification } from './gameObjects';

import * as config from './config';

import { Debug } from './Debug';
import { Spawner } from './Spawner';

import { AudioManager } from './audio/AudioManager';
import { MapConfig } from './map/MapConfig';
import { MapFactory } from './map/MapFactory';
import * as mapJSON from './map/test-enemy-tanks.json';

const renderer = new Renderer({
  // debug: true,
  height: config.CANVAS_HEIGHT,
  width: config.CANVAS_WIDTH,
});
document.body.appendChild(renderer.domElement);

const input = new KeyboardInput();
input.listen();

const scene = new GameObject();

scene.add(new Border());

const field = new GameObject(config.FIELD_SIZE, config.FIELD_SIZE);
field.position.set(config.BORDER_LEFT_WIDTH, config.BORDER_TOP_BOTTOM_HEIGHT);
scene.add(field);

const mapConfig = new MapConfig().parse(mapJSON);
const { walls } = MapFactory.create(mapConfig);

field.add(...walls);

const base = new Base();
base.position.set(352, 736);
base.died.addListener(() => {
  console.log('Game over! Reason: Base');
});
field.add(base);

const spawner = new Spawner(mapConfig, field, base);

const debug = new Debug(spawner);

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

    renderer.render(scene);

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
