import { Subject } from './Subject';
/**
 * Texture represents entire image file, which might also be a sprite.
 * In case with sprites - one texture may be reused a number of times.
 * Should be used to create Sprites.
 */
export class Texture {
  public readonly loaded = new Subject();
  public readonly imageElement: HTMLImageElement;

  constructor(imageElement: HTMLImageElement) {
    this.imageElement = imageElement;
    this.imageElement.addEventListener('load', this.handleLoaded);
  }

  public isLoaded(): boolean {
    return this.imageElement.complete;
  }

  private handleLoaded = (): void => {
    this.loaded.notify();
    this.imageElement.removeEventListener('load', this.handleLoaded);
  };
}
