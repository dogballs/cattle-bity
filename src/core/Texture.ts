/**
 * Texture represents entire image file, which might also be a sprite.
 * In case with sprites - one texture may be reused a number of times.
 * Should be used to create Sprites.
 */
export class Texture {
  public imageElement: HTMLImageElement = null;

  constructor(imageElement: HTMLImageElement = null) {
    this.imageElement = imageElement;
  }
}
