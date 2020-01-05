import { Rect } from './Rect';
import { Texture } from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  public static Rect = Rect;

  public rect: Rect;
  public texture: Texture;

  constructor(texture: Texture = new Texture(), rect: Rect = new Rect()) {
    this.texture = texture;
    this.rect = rect;
  }
}
