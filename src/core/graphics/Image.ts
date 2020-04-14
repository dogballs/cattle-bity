import { ImageSource } from './ImageSource';

/**
 * Image represents entire image file, which might also be a spritesheet.
 * In case with spritesheets - one image may be reused a number of times.
 * Should be used to create Sprites.
 */
export class Image extends ImageSource {
  private readonly imageElement: HTMLImageElement;

  constructor(imageElement: HTMLImageElement) {
    super();

    this.imageElement = imageElement;
    this.imageElement.addEventListener('load', this.handleLoaded);
  }

  public getElement(): HTMLImageElement {
    return this.imageElement;
  }

  public getWidth(): number {
    return this.imageElement.naturalWidth;
  }

  public getHeight(): number {
    return this.imageElement.naturalHeight;
  }

  public isLoaded(): boolean {
    return this.imageElement.complete;
  }

  private handleLoaded = (): void => {
    this.loaded.notify(null);
    this.imageElement.removeEventListener('load', this.handleLoaded);
  };
}
