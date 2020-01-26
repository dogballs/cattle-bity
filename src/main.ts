import {
  CollisionDetector,
  GameLoop,
  GameObject,
  KeyboardInput,
  Renderer,
} from './core';

import { Border } from './gameObjects';

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
field.position.set(config.BORDER_H_DEPTH, config.BORDER_V_DEPTH);
scene.add(field);

const mapConfig = MapConfig.fromJSON(mapJSON);
const { walls } = MapFactory.create(mapConfig);

field.add(...walls);

const spawner = new Spawner(mapConfig, field);

spawner.init();

// const grenadePowerup = new GrenadePowerup();
// grenadePowerup.position.set(100, 600);
// field.add(grenadePowerup);

const gameLoop = new GameLoop({
  onTick: (ticks: number): void => {
    input.update();

    // Update all objects on the scene
    // TODO: abstract out input from tank
    scene.traverse((child) => {
      child.update({ input, ticks });
    });

    const nodes = scene.flatten();

    const colliderNodes = nodes.filter((node) => node.collider);

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(colliderNodes, nodes);
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
