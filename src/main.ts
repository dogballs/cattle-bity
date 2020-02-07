import {
  CollisionDetector,
  GameLoop,
  GameObject,
  GameState,
  KeyboardInput,
  KeyboardKey,
  Renderer,
} from './core';

import { Border, EnemyCounter } from './gameObjects';

import * as config from './config';

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

const spawner = new Spawner(mapConfig, field);

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

// const grenadePowerup = new GrenadePowerup();
// grenadePowerup.position.set(100, 600);
// field.add(grenadePowerup);

let gameState = GameState.Playing;

const pauseAudio = AudioManager.load('pause');

const gameLoop = new GameLoop({
  onTick: (): void => {
    input.update();

    if (input.isDown(KeyboardKey.Enter)) {
      if (gameState === GameState.Playing) {
        gameState = GameState.Paused;
        AudioManager.pauseAll();
        pauseAudio.play();
      } else {
        gameState = GameState.Playing;
        AudioManager.resumeAll();
      }
    }

    // TODO: enemies with drops are still animated
    if (gameState === GameState.Paused) {
      return;
    }

    spawner.update();

    // Update all objects on the scene
    // TODO: abstract out input from tank
    scene.traverse((child) => {
      child.update({ input, gameState });
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
  },
});

gameLoop.start();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;
