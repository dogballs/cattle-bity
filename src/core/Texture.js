/**
 * Texture represents entire image file, which might also be a sprite.
 * In case with sprites - one texture may be reused a number of times.
 * Should be used to create Sprites.
 */
class Texture {
  constructor(src = '') {
    this.imageElement = new window.Image();
    this.imageElement.src = src;
  }
}

export default Texture;
