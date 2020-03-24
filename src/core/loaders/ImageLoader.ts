import { Logger } from '../Logger';
import { Image } from '../Image';

import { PathUtils } from '../utils';

export class ImageLoader {
  private loaded: Map<string, Image> = new Map();
  private basePath = '';
  protected log = new Logger(ImageLoader.name, Logger.Level.None);

  constructor(basePath = '') {
    this.basePath = basePath;
  }

  public load(path: string, isAbsolute = false): Image {
    let fullPath = path;
    if (isAbsolute === false) {
      fullPath = PathUtils.join(this.basePath, path);
    }

    if (this.loaded.has(fullPath)) {
      return this.loaded.get(fullPath);
    }

    const imageElement = new window.Image();

    const image = new Image(imageElement);

    image.loaded.addListenerOnce(() => {
      this.log.debug('Loaded "%s"', fullPath);
    });

    imageElement.src = fullPath;

    this.loaded.set(fullPath, image);

    return image;
  }

  public async loadAsync(path: string, isAbsolute = false): Promise<Image> {
    return new Promise((resolve) => {
      const image = this.load(path, isAbsolute);
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
