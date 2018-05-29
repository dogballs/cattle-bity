import Sprite from './Sprite.js';
import Vector from './Vector.js';

// Actor is a child of the Scene. It is what gets rendered.
let id = 1000;

class Actor {
  constructor(width, height) {
    this.id = id++;
    this.width = width;
    this.height = height;

    this.position = new Vector(0, 0);

    // Main sprite which will be rendered on the scene
    this.sprite = new Sprite();
  }

  // Must-have for each actor
  render() {
    return {
      width: this.width,
      height: this.height,
      position: this.position,
      sprite: this.sprite,
    };
  }
}

export default Actor;
