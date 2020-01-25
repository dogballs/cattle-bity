import { Texture } from './Texture';

export class TextureLoader {
  public static cache: Map<string, Texture> = new Map();

  public static load(src: string): Texture {
    if (this.cache.has(src)) {
      return this.cache.get(src);
    }

    const texture = new Texture();

    const image = new Image();
    image.addEventListener('load', () => {
      texture.imageElement = image;
    });
    image.src = src;

    this.cache.set(src, texture);

    return texture;
  }
}
