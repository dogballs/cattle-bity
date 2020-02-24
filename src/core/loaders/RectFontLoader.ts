import { RectFont, RectFontConfig } from '../text';

export class RectFontLoader {
  private registered = new Map<string, RectFontConfig>();
  private loaded = new Map<string, RectFont>();

  public register(id: string, config: RectFontConfig): void {
    this.registered.set(id, config);
  }

  public load(id: string): RectFont {
    const config = this.registered.get(id);
    if (config === undefined) {
      throw new Error(`Rect font "${id} not registered`);
    }

    if (this.loaded.has(id)) {
      return this.loaded.get(id);
    }

    const font = new RectFont(config);

    this.loaded.set(id, font);

    return font;
  }

  public preloadAll(): void {
    this.registered.forEach((config, id) => {
      this.load(id);
    });
  }
}
