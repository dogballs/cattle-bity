import Bullet from './models/Bullet.js';
import BulletExplosion from './models/BulletExplosion.js';
import BulletFactory from './managers/BulletFactory.js';
import Renderer from './core/Renderer.js';
import EnemyTank from './models/enemy-tank/EnemyTank.js';
import InputHandler from './handlers/InputHandler.js';
import Scene from './core/Scene.js';
import Spawn from './models/Spawn.js';
import Tank from './models/tank/Tank.js';
import MotionManager from './managers/MotionManager.js';

const renderer = new Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let renderElement = document.getElementById('canvas');
renderElement.appendChild(renderer.domElement);

const scene = new Scene();
const manager = new MotionManager(renderer, scene);

const tank = new Tank();
tank.position.x = 50;
tank.position.y = 50;
scene.add(tank);

const enemy = new EnemyTank();
enemy.position.x = 500;
enemy.position.y = 250;
enemy.rotate('down');
scene.add(enemy);

const inputHandler = new InputHandler();

inputHandler.addListener('up', () => {
  tank.rotate('up');
  tank.move();
});

inputHandler.addListener('down', () => {
  tank.rotate('down');
  tank.move();
});

inputHandler.addListener('right', () => {
  tank.rotate('right');
  tank.move();
});

inputHandler.addListener('left', () => {
  tank.rotate('left');
  tank.move();
});

const bulletFactory = new BulletFactory();

inputHandler.addListener('fire', () => {
  const bullet = bulletFactory.makeBullet(tank);
  scene.add(bullet);
});

const animate = () => {
  const sceneWidth = renderer.domElement.width;
  const sceneHeight = renderer.domElement.height;

  // Animate bullets
  const bullets = scene.children.filter(child => child instanceof Bullet);
  bullets.forEach((bullet) => {
    // TODO: simplify checking the bounds
    if (bullet.position.x < 0
      || bullet.position.x > sceneWidth
      || bullet.position.y < 0
      || bullet.position.y > sceneHeight
    ) {
      scene.remove(bullet);
      return;
    }

    bullet.move();
  });

  // Animate enemy tank to continuously go up and down
  enemy.move();
  if (enemy.position.y + enemy.height > sceneHeight) {
    enemy.rotate('up');
  } else if (enemy.position.y < 0) {
    enemy.rotate('down');
  }

  // Animate explosions
  const bulletExplosions = scene.children.filter(child =>
    child instanceof BulletExplosion
  );
  bulletExplosions.forEach(bulletExplosion => bulletExplosion.update());

  // Animate spawns
  const spawns = scene.children.filter(child =>
    child instanceof Spawn
  );
  spawns.forEach(spawn => spawn.update());

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();

// Create sample explosions
setInterval(() => {
  const bulletExplosion = new BulletExplosion();
  bulletExplosion.position.x = 800;
  bulletExplosion.position.y = 50;
  bulletExplosion.onComplete = () => {
    scene.remove(bulletExplosion);
  };
  scene.add(bulletExplosion);
}, 1000);

// Crate sample spawns
setInterval(() => {
  const spawn = new Spawn();
  spawn.position.x = 900;
  spawn.position.y = 50;
  spawn.onComplete = () => {
    scene.remove(spawn);
  };
  scene.add(spawn);
}, 1500);
