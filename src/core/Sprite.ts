import { Dimensions } from './Dimensions';
import { Rect } from './Rect';
import { Texture } from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  public static Dimensions = Dimensions;
  public static Rect = Rect;

  /**
   * Location of the sprite on the original texture
   * @type {Rect}
   */
  public textureRect: Rect;
  public texture: Texture;
  /**
   * Desired rendered size
   * @type {Dimensions}
   */
  public targetDims: Dimensions;

  constructor(
    texture: Texture = new Texture(),
    textureRect: Rect = new Rect(),
    targetDims: Dimensions = new Dimensions(),
  ) {
    this.texture = texture;
    this.textureRect = textureRect;
    this.targetDims = targetDims;
  }
}
