import CollisionDetector from './core/CollisionDetector';
import GameObject from './core/GameObject';
import KeyboardInput from './core/KeyboardInput';
import Renderer from './core/Renderer';

import BrickWallFactory from './BrickWallFactory';
import BulletFactory from './BulletFactory';

import Bullet from './gameObjects/Bullet';
import SceneWall from './gameObjects/SceneWall';
import Shield from './gameObjects/Shield';
import Spawn from './gameObjects/Spawn';

import BasicEnemyTank from './gameObjects/BasicEnemyTank';
import FastEnemyTank from './gameObjects/FastEnemyTank';
import PowerEnemyTank from './gameObjects/PowerEnemyTank';
import Tank from './gameObjects/Tank';

import GrenadePowerup from './gameObjects/GrenadePowerup';

import collisionsConfig from './collisions/collisions.config';

const renderer = new Renderer();
renderer.setSize(900, 900);
document.body.appendChild(renderer.domElement);

const input = new KeyboardInput();
input.listen();

const scene = new GameObject();

const topSceneWall = new SceneWall(900, 40);
topSceneWall.position.set(450, 20);
const bottomSceneWall = new SceneWall(900, 40);
bottomSceneWall.position.set(450, 880);
const leftSceneWall = new SceneWall(40, 900);
leftSceneWall.position.set(20, 450);
const rightSceneWall = new SceneWall(40, 900);
rightSceneWall.position.set(880, 450);

scene.add(topSceneWall);
scene.add(bottomSceneWall);
scene.add(leftSceneWall);
scene.add(rightSceneWall);

const brickWalls = BrickWallFactory.create(128, 320, 128, 256);
scene.add(...brickWalls);

// TODO: create common factory/builder for all tanks
const spawn = new Spawn();
spawn.position.set(100, 100);
spawn.onComplete = () => {
  const tank = new Tank();
  const shield = new Shield();
  tank.add(shield);

  tank.position = spawn.position.clone();
  tank.onFire = () => {
    if (scene.hasChildrenOfType(Bullet)) {
      return;
    }
    const bullet = BulletFactory.makeBullet(tank);
    scene.add(bullet);
  };
  scene.add(tank);
  scene.remove(spawn);
};
scene.add(spawn);

const enemySpawn = new Spawn();
enemySpawn.position.set(500, 250);
enemySpawn.onComplete = () => {
  const enemy = new BasicEnemyTank();
  enemy.position = enemySpawn.position.clone();
  scene.add(enemy);
  scene.remove(enemySpawn);
};
scene.add(enemySpawn);

const fastEnemySpawn = new Spawn();
fastEnemySpawn.position.set(580, 250);
fastEnemySpawn.onComplete = () => {
  const enemy = new FastEnemyTank();
  enemy.position = fastEnemySpawn.position.clone();
  scene.add(enemy);
  scene.remove(fastEnemySpawn);
};
scene.add(fastEnemySpawn);

const powerEnemySpawn = new Spawn();
powerEnemySpawn.position.set(660, 250);
powerEnemySpawn.onComplete = () => {
  const enemy = new PowerEnemyTank();
  enemy.position = powerEnemySpawn.position.clone();
  scene.add(enemy);
  scene.remove(powerEnemySpawn);
};
scene.add(powerEnemySpawn);

const grenadePowerup = new GrenadePowerup();
grenadePowerup.position.set(100, 800);
scene.add(grenadePowerup);

// Game loop

let lastFrameTime = 0;
const frameDelay = 0;
const animate = (time: number = 0) => {
  // Throttle animation
  if (time < lastFrameTime + frameDelay) {
    window.requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = time;

  // Update all objects on the scene
  // TODO: abstract out input from tank
  scene.traverse((child) => {
    child.update({ input });
  });

  // Detect and handle collisions of all objects on the scene
  const collisions = CollisionDetector.intersectObjects(scene.children);
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

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();
