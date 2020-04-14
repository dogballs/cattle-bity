import { SpriteFont, SpriteFontConfig, SpriteFontOptions } from '../text';

import { ImageLoader } from './ImageLoader';

interface RegisterItem {
  config: SpriteFontConfig;
  options: SpriteFontOptions;
}

export class SpriteFontLoader {
  private readonly imageLoader: ImageLoader;
  private registeredItems = new Map<string, RegisterItem>();
  private loadedFonts = new Map<string, SpriteFont>();

  constructor(imageLoader: ImageLoader) {
    this.imageLoader = imageLoader;
  }

  public register(
    id: string,
    config: SpriteFontConfig,
    options: SpriteFontOptions = {},
  ): void {
    const item = { config, options };
    this.registeredItems.set(id, item);
  }

  public load(id: string): SpriteFont {
    const item = this.registeredItems.get(id);
    if (item === undefined) {
      throw new Error(`Sprite font "${id} not registered`);
    }

    if (this.loadedFonts.has(id)) {
      return this.loadedFonts.get(id);
    }

    const { config, options: defaultOptions } = item;

    const image = this.imageLoader.load(config.file);

    const font = new SpriteFont(config, image, defaultOptions);

    this.loadedFonts.set(id, font);

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
    this.registeredItems.forEach((config, id) => {
      this.load(id);
    });
  }

  public async preloadAllAsync(): Promise<void> {
    await Promise.all(
      Array.from(this.registeredItems).map(([id]) => {
        return this.loadAsync(id);
      }),
    );
  }
}
