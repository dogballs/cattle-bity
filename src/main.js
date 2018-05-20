import CanvasRenderer from './CanvasRenderer.js';
import InputHandler from './InputHandler.js';
import Material from './Material.js';
import Mesh from './Mesh.js';
import Scene from './Scene.js';
import TextureLoader from './TextureLoader.js';

const scene = new Scene();

const renderer = new CanvasRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const material = new Material(1, 2, 13, 13);
const mesh = new Mesh(100, 100, material);
scene.add(mesh);

const textureLoader = new TextureLoader();
textureLoader.load('images/sprite.png', (texture) => {
  material.texture = texture;
});

const inputHandler = new InputHandler();

inputHandler.addListener('up', () => {
  mesh.position.y -= 20;
});

inputHandler.addListener('down', () => {
  mesh.position.y += 20;
});

inputHandler.addListener('right', () => {
  mesh.position.x += 20;
});

inputHandler.addListener('left', () => {
  mesh.position.x -= 20;
});

const animate = () => {
  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();


