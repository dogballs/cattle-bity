import CanvasRenderer from './CanvasRenderer.js';
import EnemyTank from './EnemyTank.js';
import InputHandler from './InputHandler.js';
import Scene from './Scene.js';
import Shell from './Shell.js';
import ShellExplosion from './ShellExplosion.js';
import ShellFactory from './ShellFactory.js';
import Tank from './Tank.js';
import MotionManager from './MotionManager.js';

const renderer = new CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

const shellFactory = new ShellFactory();

inputHandler.addListener('fire', () => {
  const shell = shellFactory.makeShell(tank);
  scene.add(shell);
});

const animate = () => {
  const sceneWidth = renderer.domElement.width;
  const sceneHeight = renderer.domElement.height;

  // Animate shells
  const shells = scene.children.filter(child => child instanceof Shell);
  shells.forEach((shell) => {
    // TODO: simplify checking the bounds
    if (shell.position.x < 0
      || shell.position.x > sceneWidth
      || shell.position.y < 0
      || shell.position.y > sceneHeight
    ) {
      scene.remove(shell);
      return;
    }

    shell.move();
  });

  // Animate enemy tank to continuously go up and down
  enemy.move();
  if (enemy.position.y + enemy.height > sceneHeight) {
    enemy.rotate('up');
  } else if (enemy.position.y < 0) {
    enemy.rotate('down');
  }

  // Animate explosions
  const shellExplosions = scene.children.filter(child => child instanceof ShellExplosion);
  shellExplosions.forEach((shellExplosion) => {
    // Remove explosion from the scene when animation has finished
    if (shellExplosion.isComplete()) {
      scene.remove(shellExplosion);
      return;
    }

    // Update explosion animation
    shellExplosion.update();
  });

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();

// Create sample explosions over a period of time
setInterval(() => {
  const shellExplosion = new ShellExplosion();
  shellExplosion.position.x = 800;
  shellExplosion.position.y = 200;
  scene.add(shellExplosion);
}, 1000);
