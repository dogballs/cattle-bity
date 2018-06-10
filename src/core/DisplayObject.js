import BoundingBox from './BoundingBox.js';
import Sprite from './Sprite.js';
import Vector from './Vector.js';

/**
 * Superclass for all things that can be drawn on screen.
 */
class DisplayObject {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.position = new Vector(0, 0);

    // Main sprite which will be rendered on the scene
    this.sprite = new Sprite();
  }

  getBoundingBox() {
    // Top-left point of the object
    const min = new Vector(
      this.position.x - (this.width / 2),
      this.position.y - (this.height / 2)
    );
    // Bottom-right point of the object
    const max = min.clone().add(new Vector(this.width, this.height));

    return new BoundingBox(min, max);
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
