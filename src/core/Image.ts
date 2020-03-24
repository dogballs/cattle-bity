import { Subject } from './Subject';
/**
 * Image represents entire image file, which might also be a spritesheet.
 * In case with spritesheets - one image may be reused a number of times.
 * Should be used to create Sprites.
 */
export class Image {
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
