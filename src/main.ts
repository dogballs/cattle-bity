import {
  CollisionDetector,
  GameLoop,
  GameObject,
  KeyboardInput,
  Renderer,
} from './core';

import { Border, EnemyCounter } from './gameObjects';

import * as config from './config';

import { Spawner } from './Spawner';

import { MapConfig } from './map/MapConfig';
import { MapFactory } from './map/MapFactory';
import * as mapJSON from './map/test-enemy-tanks.json';

const renderer = new Renderer({
  debug: true,
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
  console.log('hello');
  enemyCounter.updateCount(spawner.getUnspawnedEnemiesCount());
});

// const grenadePowerup = new GrenadePowerup();
// grenadePowerup.position.set(100, 600);
// field.add(grenadePowerup);

const gameLoop = new GameLoop({
  onTick: (): void => {
    input.update();

    spawner.update();

    // Update all objects on the scene
    // TODO: abstract out input from tank
    scene.traverse((child) => {
      child.update({ input });
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
