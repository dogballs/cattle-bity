import { Rect } from './Rect';
import { Texture } from './Texture';

/**
 * Represents a specific fragment of the texture by the coordinates.
 * The coordinates will be used by renderer to render the fragment.
 */
export class Sprite {
  public texture: Texture;
  public sourceRect: Rect;
  public targetRect: Rect;

  constructor(
    texture: Texture = new Texture(),
    sourceRect: Rect = new Rect(),
    targetRect: Rect = new Rect(),
  ) {
    this.texture = texture;
    this.sourceRect = sourceRect;
    this.targetRect = targetRect;
  }

  public isTextureReady(): boolean {
    return this.texture.imageElement !== null;
  }
}
