import { Image } from './Image';
import { Rect } from './Rect';

/**
 * Represents a specific fragment of an image by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  public image: Image;
  public sourceRect: Rect;
  public targetRect: Rect;

  constructor(
    image: Image,
    sourceRect: Rect = new Rect(),
    targetRect: Rect = new Rect(),
  ) {
    this.image = image;
    this.sourceRect = sourceRect;
    this.targetRect = targetRect;
  }

  public isImageLoaded(): boolean {
    return this.image.isLoaded();
  }
}
