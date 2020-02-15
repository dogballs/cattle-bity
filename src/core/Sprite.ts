import { Rect } from './Rect';
import { Size } from './Size';
import { Texture } from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  /**
   * Location of the sprite on the original texture
   * @type {Rect}
   */
  public textureRect: Rect;
  public texture: Texture;
  /**
   * Desired rendered size
   * @type {Size}
   */
  public targetSize: Size;

  constructor(
    texture: Texture = new Texture(),
    textureRect: Rect = new Rect(),
    targetSize: Size = new Size(),
  ) {
    this.texture = texture;
    this.textureRect = textureRect;
    this.targetSize = targetSize;
  }
}
