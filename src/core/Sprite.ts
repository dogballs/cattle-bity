import Rect from './Rect';
import Texture from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
class Sprite {
  public static Rect = Rect;

  public bounds: object;
  public texture: Texture;

  constructor(texture = new Texture(), bounds = new Rect()) {
    this.texture = texture;
    this.bounds = bounds;
  }
}

export default Sprite;
