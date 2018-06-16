import CollisionDetector from './core/CollisionDetector';
import KeyboardInput from './core/KeyboardInput';
import Renderer from './core/Renderer';
import Scene from './core/Scene';

import BulletFactory from './managers/BulletFactory';
import MapBuilder from './managers/MapBuilder';

import Bullet from './models/Bullet';
import SceneWall from './models/SceneWall';
import Shield from './models/Shield';
import Spawn from './models/Spawn';

import BasicEnemyTank from './models/BasicEnemyTank';
import FastEnemyTank from './models/FastEnemyTank';
import PowerEnemyTank from './models/PowerEnemyTank';
import Tank from './models/Tank';

import GrenadePowerup from './models/GrenadePowerup';

import collisionsConfig from './collisions/collisions.config';
import map from './maps/1/description';

const renderer = new Renderer();
renderer.setSize(900, 900);
document.body.appendChild(renderer.domElement);

const input = new KeyboardInput();
input.listen();

const scene = new Scene();
const mapBuilder = new MapBuilder(scene);

mapBuilder.buildMap(map);

const topSceneWall = new SceneWall(900, 40);
const bottomSceneWall = new SceneWall(900, 40);
bottomSceneWall.position.y = 860;
const leftSceneWall = new SceneWall(40, 900);
const rightSceneWall = new SceneWall(40, 900);
rightSceneWall.position.x = 860;

scene.add(topSceneWall);
scene.add(bottomSceneWall);
scene.add(leftSceneWall);
scene.add(rightSceneWall);

// TODO: create common factory/builder for all tanks
const spawn = new Spawn();
spawn.position.set(100, 100);
spawn.onComplete = () => {
  const tank = new Tank();
  tank.position = spawn.position.clone();
  tank.onFire = () => {
    if (scene.hasType(Bullet)) {
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

const shield = new Shield();
shield.position.set(200, 800);
scene.add(shield);

// Game loop

const animate = () => {
  // Update all objects on the scene
  // TODO: abstract out input from tank
  scene.children.forEach((child) => child.update({ input }));

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
