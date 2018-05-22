import CanvasRenderer from './CanvasRenderer.js';
import InputHandler from './InputHandler.js';
import Scene from './Scene.js';
import Tank from './Tank.js';

const renderer = new CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
const tank = new Tank();
scene.add(tank);

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

const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();


