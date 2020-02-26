import { SpriteFont, SpriteFontConfig } from '../text';

import { TextureLoader } from './TextureLoader';

export class SpriteFontLoader {
  private readonly textureLoader: TextureLoader;
  private registered = new Map<string, SpriteFontConfig>();
  private loaded = new Map<string, SpriteFont>();

  constructor(textureLoader: TextureLoader) {
    this.textureLoader = textureLoader;
  }

  public register(id: string, config: SpriteFontConfig): void {
    this.registered.set(id, config);
  }

  public load(id: string): SpriteFont {
    const config = this.registered.get(id);
    if (config === undefined) {
      throw new Error(`Sprite font "${id} not registered`);
    }

    if (this.loaded.has(id)) {
      return this.loaded.get(id);
    }

    // TODO: paths
    const texture = this.textureLoader.load(config.file, true);

    const font = new SpriteFont(config, texture);

    this.loaded.set(id, font);

    return font;
  }

  public async loadAsync(id: string): Promise<SpriteFont> {
    return new Promise((resolve) => {
      const font = this.load(id);
      if (font.texture.isLoaded()) {
        resolve(font);
      } else {
        font.texture.loaded.addListenerOnce(() => {
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
