import Bullet from './models/bullet/Bullet.js';
import BulletExplosion from './models/bullet/BulletExplosion.js';
import BulletFactory from './managers/BulletFactory.js';
import Renderer from './core/Renderer.js';
import EnemyTank from './models/enemy-tank/EnemyTank.js';
import InputHandler from './handlers/InputHandler.js';
import Scene from './core/Scene.js';
import Tank from './models/tank/Tank.js';
import MotionManager from './managers/MotionManager.js';
import Block from './models/block/Block.js';
import MapBuilder from './managers/MapBuilder.js';
import map from '../maps/1/description.js';

const renderer = new Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
let renderElement = document.getElementById('canvas');
renderElement.appendChild(renderer.domElement);

const scene = new Scene();
const manager = new MotionManager(renderer, scene);
const mapBuilder = new MapBuilder(scene);

mapBuilder.buildMap(map);

const tank = new Tank();
tank.position.x = 50;
tank.position.y = 50;
scene.add(tank);

const enemy = new EnemyTank();
enemy.position.x = 600;
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
  const bulletExplosions = scene.children.filter(child => child instanceof BulletExplosion);
  bulletExplosions.forEach((bulletExplosion) => {
    // Remove explosion from the scene when animation has finished
    if (bulletExplosion.isComplete()) {
      scene.remove(bulletExplosion);
      return;
    }

    // Update explosion animation
    bulletExplosion.update();
  });

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();

// Create sample explosions over a period of time
setInterval(() => {
  const bulletExplosion = new BulletExplosion();
  bulletExplosion.position.x = 800;
  bulletExplosion.position.y = 200;
  scene.add(bulletExplosion);
}, 1000);
