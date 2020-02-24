import { Logger } from '../Logger';
import { Texture } from '../Texture';

import { PathUtils } from '../utils';

export class TextureLoader {
  private cache: Map<string, Texture> = new Map();
  private basePath = '';
  protected log = new Logger(TextureLoader.name, Logger.Level.Debug);

  constructor(basePath = '') {
    this.basePath = basePath;
  }

  public load(path: string, isAbsolute = false): Texture {
    let fullPath = path;
    if (isAbsolute === false) {
      fullPath = PathUtils.join(this.basePath, path);
    }

    if (this.cache.has(fullPath)) {
      return this.cache.get(fullPath);
    }

    const texture = new Texture();

    const image = new Image();
    image.addEventListener('load', () => {
      this.log.debug('Loaded "%s"', fullPath);
      texture.imageElement = image;
    });
    image.src = fullPath;

    this.cache.set(fullPath, texture);

    return texture;
  }
}
