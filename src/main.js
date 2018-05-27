import CanvasRenderer from './CanvasRenderer.js';
import EnemyTank from './EnemyTank.js';
import InputHandler from './InputHandler.js';
import Scene from './Scene.js';
import Shell from './Shell.js';
import ShellFactory from './ShellFactory.js';
import Tank from './Tank.js';

const renderer = new CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();

const tank = new Tank();
scene.add(tank);

const enemy = new EnemyTank();
enemy.position.x = 500;
enemy.position.y = 0;
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

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();
