import {
  CollisionDetector,
  GameLoop,
  GameObject,
  KeyboardInput,
  Renderer,
} from './core';

import BulletFactory from './BulletFactory';

import {
  BasicEnemyTank,
  Border,
  Bullet,
  FastEnemyTank,
  GrenadePowerup,
  PowerEnemyTank,
  Shield,
  Spawn,
  Tank,
} from './gameObjects';

import * as config from './config';

import { MapFactory } from './map/MapFactory';
import * as mapConfig from './map/stage1.json';

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

const { objects } = MapFactory.create(mapConfig);

field.add(...objects);

// TODO: create common factory/builder for all tanks
const spawn = new Spawn();
spawn.position.set(256, 768);
spawn.onComplete = (): void => {
  const tank = new Tank();
  const shield = new Shield();
  shield.setCenterFrom(tank);
  tank.add(shield);

  tank.setCenterFrom(spawn);
  tank.onFire = (): void => {
    if (field.hasChildrenOfType(Bullet)) {
      return;
    }
    const bullet = BulletFactory.makeBullet(tank);
    field.add(bullet);
  };
  spawn.replaceSelf(tank);
};
field.add(spawn);

const enemySpawn = new Spawn();
enemySpawn.position.set(384, 0);
enemySpawn.onComplete = (): void => {
  const enemy = new BasicEnemyTank();
  enemy.rotation = GameObject.Rotation.Down;
  enemy.setCenterFrom(enemySpawn);
  enemySpawn.replaceSelf(enemy);
};
field.add(enemySpawn);

const fastEnemySpawn = new Spawn();
fastEnemySpawn.position.set(580, 250);
fastEnemySpawn.onComplete = (): void => {
  const enemy = new FastEnemyTank();
  enemy.setCenterFrom(fastEnemySpawn);
  fastEnemySpawn.replaceSelf(enemy);
};
field.add(fastEnemySpawn);

const powerEnemySpawn = new Spawn();
powerEnemySpawn.position.set(660, 250);
powerEnemySpawn.onComplete = (): void => {
  const enemy = new PowerEnemyTank();
  enemy.setCenterFrom(powerEnemySpawn);
  powerEnemySpawn.replaceSelf(enemy);
};
field.add(powerEnemySpawn);

const grenadePowerup = new GrenadePowerup();
grenadePowerup.position.set(100, 600);
field.add(grenadePowerup);

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
