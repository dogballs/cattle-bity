import Texture from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
class Sprite {
  public bounds: object;
  public texture: Texture;

  constructor(texture = new Texture(), bounds = {
    h: 0, w: 0, x: 0, y: 0,
  }) {
    this.texture = texture;
    this.bounds = bounds;
  }
}

export default Sprite;
