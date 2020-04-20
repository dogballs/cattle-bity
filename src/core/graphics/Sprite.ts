import { Rect } from '../Rect';

import { ImageSource } from './ImageSource';

/**
 * Represents a specific fragment of an image by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  public image: ImageSource;
  public sourceRect: Rect;
  public destinationRect: Rect;

  constructor(
    image: ImageSource,
    sourceRect: Rect = new Rect(),
    destinationRect: Rect = new Rect(),
  ) {
    this.image = image;
    this.sourceRect = sourceRect;
    this.destinationRect = destinationRect;
  }

  public isImageLoaded(): boolean {
    return this.image.isLoaded();
  }
}
