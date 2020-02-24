import { Rect, Rotation, Sprite, SpriteLoader } from '../core';

import { TankType } from './TankType';

const SPRITE_TANK_PREFIX = 'tank';
const SPRITE_ID_SEPARATOR = '.';

export class TankSpriteFactory {
  public static create(
    spriteLoader: SpriteLoader,
    type: TankType,
    targetRect: Rect,
    rotation: Rotation,
    frameNumber = 1,
  ): Sprite {
    const parts = [
      SPRITE_TANK_PREFIX,
      type.party.toString(),
      type.color.toString(),
      type.tier.toString(),
      rotation.toString(),
      frameNumber.toString(),
    ];

    const spriteId = parts.join(SPRITE_ID_SEPARATOR);

    let rotatedRect = targetRect;
    if (rotation === Rotation.Left || rotation === Rotation.Right) {
      rotatedRect = new Rect(
        targetRect.x,
        targetRect.y,
        targetRect.height,
        targetRect.width,
      );
    }

    const sprite = spriteLoader.load(spriteId, rotatedRect);

    return sprite;
  }
}
