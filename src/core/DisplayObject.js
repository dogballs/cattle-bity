import Sprite from './Sprite.js';
import Vector from './Vector.js';

let id = 1000;

/**
 * Superclass for all things that can be drawn on screen.
 */
class DisplayObject {
  constructor(width, height) {
    this.id = id;
    id += 1;

    this.width = width;
    this.height = height;

    this.position = new Vector(0, 0);

    // Main sprite which will be rendered on the scene
    this.sprite = new Sprite();
  }

  // Must-have for each render object
  render() {
    return {
      width: this.width,
      height: this.height,
      position: this.position,
      sprite: this.sprite,
    };
  }
}

export default DisplayObject;
