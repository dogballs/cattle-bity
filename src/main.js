import CanvasRenderer from './CanvasRenderer.js';
import Scene from './Scene.js';
import Mesh from './Mesh.js';
import TextureLoader from './TextureLoader.js';
import Material from './Material.js';

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

const animate = () => {
  mesh.position.x += 1;
  mesh.position.y += 1;

  window.requestAnimationFrame(animate);
  renderer.render(scene);
};
animate();
