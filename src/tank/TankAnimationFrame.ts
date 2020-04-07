import { Sprite, SpriteLoader } from '../core';
import { Rotation } from '../game';

import { TankColor } from './TankColor';
import { TankSpriteId } from './TankSpriteId';
import { TankType } from './TankType';

export class TankAnimationFrame {
  private sprites: Sprite[];

  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    colors: TankColor[],
    rotation: Rotation,
    frameNumber = 1,
  ) {
    this.sprites = colors.map((color) => {
      const spriteId = TankSpriteId.create(type, color, rotation, frameNumber);
      const sprite = spriteLoader.load(spriteId);
      return sprite;
    });
  }

  public getSprite(index: number): Sprite {
    const sprite = this.sprites[index];
    if (sprite === undefined) {
      return null;
    }
    return sprite;
  }
}
