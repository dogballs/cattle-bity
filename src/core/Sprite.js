import Texture from './Texture.js';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
class Sprite {
  constructor(texture = new Texture(), bounds = {
    x: 0, y: 0, w: 0, h: 0,
  }) {
    this.texture = texture;
    this.bounds = bounds;
  }
}

export default Sprite;
