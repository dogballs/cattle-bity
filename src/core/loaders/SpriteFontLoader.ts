import { SpriteFont, SpriteFontConfig, SpriteFontOptions } from '../text';

import { ImageLoader } from './ImageLoader';

interface RegisterItem {
  config: SpriteFontConfig;
  options: SpriteFontOptions;
}

export class SpriteFontLoader {
  private readonly imageLoader: ImageLoader;
  private registered = new Map<string, RegisterItem>();
  private loaded = new Map<string, SpriteFont>();

  constructor(imageLoader: ImageLoader) {
    this.imageLoader = imageLoader;
  }

  public register(
    id: string,
    config: SpriteFontConfig,
    options: SpriteFontOptions = {},
  ): void {
    const item = { config, options };
    this.registered.set(id, item);
  }

  public load(id: string): SpriteFont {
    const item = this.registered.get(id);
    if (item === undefined) {
      throw new Error(`Sprite font "${id} not registered`);
    }

    if (this.loaded.has(id)) {
      return this.loaded.get(id);
    }

    const { config, options: defaultOptions } = item;

    // TODO: paths
    const image = this.imageLoader.load(config.file, true);

    const font = new SpriteFont(config, image, defaultOptions);

    this.loaded.set(id, font);

    return font;
  }

  public async loadAsync(id: string): Promise<SpriteFont> {
    return new Promise((resolve) => {
      const font = this.load(id);
      if (font.image.isLoaded()) {
        resolve(font);
      } else {
        font.image.loaded.addListenerOnce(() => {
          resolve(font);
        });
      }
    });
  }

  public preloadAll(): void {
    this.registered.forEach((config, id) => {
      this.load(id);
    });
  }

  public async preloadAllAsync(): Promise<void> {
    await Promise.all(
      Array.from(this.registered).map(([id]) => {
        return this.loadAsync(id);
      }),
    );
  }
}
