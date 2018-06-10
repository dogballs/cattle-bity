import Bullet from './models/Bullet.js';
import BulletExplosion from './models/BulletExplosion.js';
import BulletFactory from './managers/BulletFactory.js';
import CollisionDetector from './core/CollisionDetector.js';
import EnemyTank from './models/EnemyTank.js';
import KeyboardInput from './core/KeyboardInput.js';
import MapBuilder from './managers/MapBuilder.js';
import Renderer from './core/Renderer.js';
import Scene from './core/Scene.js';
import SceneWall from './models/SceneWall.js';
import Spawn from './models/Spawn.js';
import Tank from './models/Tank.js';

import collisionsConfig from './collisions/collisions.config.js';
import map from './maps/1/description.js';

const renderer = new Renderer();
renderer.setSize(900, 900);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const mapBuilder = new MapBuilder(scene);

mapBuilder.buildMap(map);

const tank = new Tank();
tank.position.x = 120;
tank.position.y = 120;
scene.add(tank);

const enemy = new EnemyTank();
enemy.position.x = 600;
enemy.position.y = 250;
enemy.rotate('down');
scene.add(enemy);

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

const input = new KeyboardInput();
input.listen();

const animate = () => {
  // Handle keyboard input to control tank

  if (input.isPressedLast(KeyboardInput.KEY_W)) {
    tank.rotate('up');
  }
  if (input.isPressedLast(KeyboardInput.KEY_S)) {
    tank.rotate('down');
  }
  if (input.isPressedLast(KeyboardInput.KEY_D)) {
    tank.rotate('right');
  }
  if (input.isPressedLast(KeyboardInput.KEY_A)) {
    tank.rotate('left');
  }

  const moveKeys = [
    KeyboardInput.KEY_W,
    KeyboardInput.KEY_A,
    KeyboardInput.KEY_S,
    KeyboardInput.KEY_D,
  ];
  if (input.isPressedAny(moveKeys)) {
    tank.move();
  }

  if (input.isPressed(KeyboardInput.KEY_SPACE) && !scene.hasType(Bullet)) {
    const bullet = BulletFactory.makeBullet(tank);
    scene.add(bullet);
  }

  // Animate bullets
  const bullets = scene.filterType(Bullet);
  bullets.forEach(bullet => bullet.move());

  // Animate enemy tank to continuously go up and down
  enemy.move();

  // Animate explosions
  const bulletExplosions = scene.filterType(BulletExplosion);
  bulletExplosions.forEach(bulletExplosion => bulletExplosion.update());

  // Animate spawns
  const spawns = scene.filterType(Spawn);
  spawns.forEach(spawn => spawn.update());

  // Detect and handle collisions of all objects on the map
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

// Crate sample spawns
setInterval(() => {
  const spawn = new Spawn();
  spawn.position.x = 300;
  spawn.position.y = 150;
  spawn.onComplete = () => {
    scene.remove(spawn);
  };
  scene.add(spawn);
}, 1500);
