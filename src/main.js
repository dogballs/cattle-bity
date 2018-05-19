import CanvasRenderer from './CanvasRenderer.js';
import Scene from './Scene.js';
import Rectangle from './Rectangle.js';

const scene = new Scene();

const renderer = new CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const rect = new Rectangle(100, 100);
scene.add(rect);

const animate = () => {
  rect.position.x += 1;
  rect.position.y += 1;

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();
