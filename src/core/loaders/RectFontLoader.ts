import { RectFont, RectFontConfig, RectFontOptions } from '../text';

interface RegisteredItem {
  config: RectFontConfig;
  options: RectFontOptions;
}

export class RectFontLoader {
  private registered = new Map<string, RegisteredItem>();
  private loaded = new Map<string, RectFont>();

  public register(
    id: string,
    config: RectFontConfig,
    options: RectFontOptions = {},
  ): void {
    const item = { config, options };
    this.registered.set(id, item);
  }

  public load(id: string): RectFont {
    const item = this.registered.get(id);
    if (item === undefined) {
      const error = new Error(`Rect font "${id} not registered`);

      throw error;
    }

    if (this.loaded.has(id)) {
      return this.loaded.get(id);
    }

    const { config, options: defaultOptions } = item;
    const font = new RectFont(config, defaultOptions);

    this.loaded.set(id, font);

    return font;
  }

  public preloadAll(): void {
    this.registered.forEach((config, id) => {
      this.load(id);
    });
  }
}
