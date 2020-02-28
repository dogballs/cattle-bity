import { Rect } from '../Rect';
import { Sprite } from '../Sprite';

import { TextureLoader } from './TextureLoader';

interface SpriteManifestItem {
  file: string;
  rect: number[];
}

interface SpriteManifest {
  [id: string]: SpriteManifestItem;
}

interface SpriteLoaderOptions {
  scale?: number;
}

const DEFAULT_OPTIONS = {
  scale: 1,
};

export class SpriteLoader {
  private readonly textureLoader: TextureLoader;
  private readonly manifest: SpriteManifest;
  private readonly options: SpriteLoaderOptions;

  constructor(
    textureLoader: TextureLoader,
    manifest: SpriteManifest,
    options: SpriteLoaderOptions = {},
  ) {
    this.textureLoader = textureLoader;
    this.manifest = manifest;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public load(id: string, argTargetRect?: Rect): Sprite {
    const item = this.manifest[id];
    if (item === undefined) {
      throw new Error(`Invalid sprite id = "${id}"`);
    }

    const { file: fileName, rect: sourceRectValues } = item;
    const texture = this.textureLoader.load(fileName);
    const sourceRect = new Rect(...sourceRectValues);

    const defaultTargetRect = new Rect(
      0,
      0,
      sourceRect.width * this.options.scale,
      sourceRect.height * this.options.scale,
    );

    const targetRect = argTargetRect ?? defaultTargetRect;

    const sprite = new Sprite(texture, sourceRect, targetRect);

    return sprite;
  }

  public async loadAsync(id: string, targetRect = new Rect()): Promise<Sprite> {
    return new Promise((resolve) => {
      const sprite = this.load(id, targetRect);
      if (sprite.texture.isLoaded()) {
        resolve(sprite);
      } else {
        sprite.texture.loaded.addListenerOnce(() => {
          resolve(sprite);
        });
      }
    });
  }

  public loadList(ids: string[]): Sprite[] {
    const sprites = ids.map((id) => {
      const sprite = this.load(id);

      return sprite;
    });

    return sprites;
  }

  public preloadAll(): void {
    Object.keys(this.manifest).forEach((id) => {
      this.load(id);
    });
  }

  public async preloadAllAsync(): Promise<void> {
    await Promise.all(
      Object.keys(this.manifest).map((id) => {
        return this.loadAsync(id);
      }),
    );
  }
}
