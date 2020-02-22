import { Rect, Rotation, Sprite } from '../core';
import { SpriteFactory } from '../sprite/SpriteFactory';

import { TankColor } from './TankColor';
import { TankParty } from './TankParty';
import { TankTier } from './TankTier';

const SPRITE_TANK_PREFIX = 'tank';
const SPRITE_ID_SEPARATOR = '.';

export class TankSpriteFactory {
  public static create(
    party: TankParty,
    color: TankColor,
    tier: TankTier,
    targetRect: Rect,
    rotation: Rotation,
    frameNumber = 1,
  ): Sprite {
    const parts = [
      SPRITE_TANK_PREFIX,
      party.toString(),
      color.toString(),
      tier.toString(),
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

    const sprite = SpriteFactory.asOne(spriteId, rotatedRect);

    return sprite;
  }
}
