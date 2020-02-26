import { Logger } from '../Logger';
import { Texture } from '../Texture';

import { PathUtils } from '../utils';

export class TextureLoader {
  private loaded: Map<string, Texture> = new Map();
  private basePath = '';
  protected log = new Logger(TextureLoader.name, Logger.Level.None);

  constructor(basePath = '') {
    this.basePath = basePath;
  }

  public load(path: string, isAbsolute = false): Texture {
    let fullPath = path;
    if (isAbsolute === false) {
      fullPath = PathUtils.join(this.basePath, path);
    }

    if (this.loaded.has(fullPath)) {
      return this.loaded.get(fullPath);
    }

    const image = new Image();

    const texture = new Texture(image);

    texture.loaded.addListenerOnce(() => {
      this.log.debug('Loaded "%s"', fullPath);
    });

    image.src = fullPath;

    this.loaded.set(fullPath, texture);

    return texture;
  }

  public async loadAsync(path: string, isAbsolute = false): Promise<Texture> {
    return new Promise((resolve) => {
      const texture = this.load(path, isAbsolute);
      if (texture.isLoaded()) {
        resolve(texture);
      } else {
        texture.loaded.addListenerOnce(() => {
          resolve(texture);
        });
      }
    });
  }
}
