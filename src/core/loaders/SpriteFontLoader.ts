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

  public preloadAll(): void {
    this.registered.forEach((config, id) => {
      this.load(id);
    });
  }
}
