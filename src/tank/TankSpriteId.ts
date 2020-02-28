import { Rotation } from '../core';

import { TankType } from './TankType';

const SPRITE_TANK_PREFIX = 'tank';
const SPRITE_ID_SEPARATOR = '.';

export class TankSpriteId {
  public static create(
    type: TankType,
    rotation: Rotation,
    frameNumber = 1,
  ): string {
    const parts = [
      SPRITE_TANK_PREFIX,
      type.party.toString(),
      type.color.toString(),
      type.tier.toString(),
      rotation.toString(),
      frameNumber.toString(),
    ];

    const spriteId = parts.join(SPRITE_ID_SEPARATOR);

    return spriteId;
  }
}
