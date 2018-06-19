import Sprite from '../core/Sprite';
import Texture from '../core/Texture';

import config from './sprite.config';

export interface IMapNameToId {
  [name: string]: string;
}

export interface IMapNameToSprite {
  [name: string]: Sprite;
}

class SpriteFactory {
  public static asOne(id: string): Sprite {
    const spriteConfig = config[id];
    if (spriteConfig === undefined) {
      throw new Error(`Invalid sprite id = "${id}"`);
    }

    const [imagePath, ...dimensions] = spriteConfig;

    const texture = new Texture(imagePath);
    const rect = new Sprite.Rect(...dimensions);
    const sprite = new Sprite(texture, rect);

    return sprite;
  }

  public static asMap(mapNameToId: IMapNameToId): IMapNameToSprite {
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

export default SpriteFactory;
