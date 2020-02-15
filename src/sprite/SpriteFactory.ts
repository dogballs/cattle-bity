import { Rect, Size, Sprite, TextureLoader } from '../core';
import { PathUtils } from '../utils';
import { GRAPHICS_BASE_PATH } from '../config';

import config from './sprite.config';

export interface MapNameToId {
  [name: string]: string;
}

export interface MapNameToSprite {
  [name: string]: Sprite;
}

// TODO: refactor, used as a singleton

export class SpriteFactory {
  public static asOne(id: string, targetSize = new Size()): Sprite {
    const spriteConfig = config[id];
    if (spriteConfig === undefined) {
      throw new Error(`Invalid sprite id = "${id}"`);
    }

    const [imageName, ...textureRectValues] = spriteConfig;
    const imagePath = PathUtils.join(GRAPHICS_BASE_PATH, imageName);

    const texture = TextureLoader.load(imagePath);
    const textureRect = new Rect(...textureRectValues);
    const sprite = new Sprite(texture, textureRect, targetSize);

    return sprite;
  }

  public static asMap(mapNameToId: MapNameToId): MapNameToSprite {
    const mapNameToSprite = {};

    Object.keys(mapNameToId).forEach((name) => {
      const id = mapNameToId[name];
      const sprite = SpriteFactory.asOne(id);

      mapNameToSprite[name] = sprite;
    });

    return mapNameToSprite;
  }

  public static asList(ids: string[]): Sprite[] {
    const sprites = ids.map((id) => {
      const sprite = SpriteFactory.asOne(id);

      return sprite;
    });

    return sprites;
  }
}
