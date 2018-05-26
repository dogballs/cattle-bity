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
enemy.position.y = 200;
scene.add(enemy);


const inputHandler = new InputHandler();

inputHandler.addListener('up', () => {
  tank.moveUp();
});

inputHandler.addListener('down', () => {
  tank.moveDown();
});

inputHandler.addListener('right', () => {
  tank.moveRight();
});

inputHandler.addListener('left', () => {
  tank.moveLeft();
});

const shellFactory = new ShellFactory();

inputHandler.addListener('fire', () => {
  const shell = shellFactory.makeShell(tank);
  scene.add(shell);
});

const animate = () => {
  const shells = scene.children.filter(child => child instanceof Shell);
  shells.forEach((shell) => {
    // TODO: simplify checking the bounds
    if (shell.position.x < 0
      || shell.position.x > renderer.domElement.width
      || shell.position.y < 0
      || shell.position.y > renderer.domElement.height
    ) {
      scene.remove(shell);
      return;
    }

    shell.move();
  });

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();
