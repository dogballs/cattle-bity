import { RectFont, RectFontConfig, RectFontOptions } from '../text';

interface RegisteredItem {
  config: RectFontConfig;
  options: RectFontOptions;
}

export class RectFontLoader {
  private registeredItems = new Map<string, RegisteredItem>();
  private loadedFonts = new Map<string, RectFont>();

  public register(
    id: string,
    config: RectFontConfig,
    options: RectFontOptions = {},
  ): void {
    const item = { config, options };
    this.registeredItems.set(id, item);
  }

  public load(id: string): RectFont {
    const item = this.registeredItems.get(id);
    if (item === undefined) {
      const error = new Error(`Rect font "${id} not registered`);

      throw error;
    }

    if (this.loadedFonts.has(id)) {
      return this.loadedFonts.get(id);
    }

    const { config, options: defaultOptions } = item;
    const font = new RectFont(config, defaultOptions);

    this.loadedFonts.set(id, font);

    return font;
  }

  public preloadAll(): void {
    this.registeredItems.forEach((config, id) => {
      this.load(id);
    });
  }
}
