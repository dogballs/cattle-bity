import Sprite from './Sprite.js';
import Vector from './Vector.js';

// Actor is a child of the Scene. It is what gets rendered.

class Actor {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.position = new Vector(0, 0);

    // Main sprite which will be rendered on the scene
    this.sprite = new Sprite();
  }
}

export default Actor;
