import Vector from './Vector.js';

// Texture represents entire image file, which might also be a sprite.
// In case with sprites - one texture may be reused a number of times.

class Texture {
  constructor(imageElement = new Image()) {
    this.imageElement = imageElement;
  }
}

export default Texture;
