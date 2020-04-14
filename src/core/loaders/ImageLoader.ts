import { Image } from '../graphics';

import { Logger } from '../Logger';

export class ImageLoader {
  protected log = new Logger(ImageLoader.name, Logger.Level.None);
  private images: Map<string, Image> = new Map();

  public load(filePath: string): Image {
    if (this.images.has(filePath)) {
      return this.images.get(filePath);
    }

    const imageElement = new window.Image();

    const image = new Image(imageElement);

    image.loaded.addListenerOnce(() => {
      this.log.debug('Loaded "%s"', filePath);
    });

    imageElement.src = filePath;

    this.images.set(filePath, image);

    return image;
  }

  public async loadAsync(path: string): Promise<Image> {
    return new Promise((resolve) => {
      const image = this.load(path);
      if (image.isLoaded()) {
        resolve(image);
      } else {
        image.loaded.addListenerOnce(() => {
          resolve(image);
        });
      }
    });
  }
}
