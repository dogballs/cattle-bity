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

import collisionsConfig from './collisions/collisions.config';

import * as config from './config';

import { MapFactory } from './map/MapFactory';
import * as mapConfig from './map/test.json';

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
spawn.position.set(0, 0);
spawn.onComplete = (): void => {
  const tank = new Tank();
  const shield = new Shield();
  shield.setCenterFrom(tank);
  tank.add(shield);

  tank.position = spawn.position.clone();
  tank.onFire = (): void => {
    if (field.hasChildrenOfType(Bullet)) {
      return;
    }
    const bullet = BulletFactory.makeBullet(tank);
    field.add(bullet);
  };
  field.add(tank);
  field.remove(spawn);
};
field.add(spawn);

const enemySpawn = new Spawn();
enemySpawn.position.set(500, 250);
enemySpawn.onComplete = (): void => {
  const enemy = new BasicEnemyTank();
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
grenadePowerup.position.set(100, 300);
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

    // Detect and handle collisions of all objects on the scene
    const collisions = CollisionDetector.intersectObjects(nodes);
    collisions.forEach((collision) => {
      const collisionConfig = collisionsConfig.find((config) => {
        const sourceMatches = collision.source instanceof config.sourceType;
        const targetMatches = collision.target instanceof config.targetType;

        return sourceMatches && targetMatches;
      });

      if (collisionConfig === undefined) {
        return;
      }

      const collisionHandler = new collisionConfig.Instance(collision, scene);
      collisionHandler.collide();
    });

    renderer.render(scene);
  },
});

gameLoop.start();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.gameLoop = gameLoop;
