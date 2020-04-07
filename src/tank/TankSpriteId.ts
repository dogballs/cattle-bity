import { Rotation } from '../game';

import { TankColor } from './TankColor';
import { TankType } from './TankType';

const SPRITE_TANK_PREFIX = 'tank';
const SPRITE_ID_SEPARATOR = '.';

export class TankSpriteId {
  public static create(
    type: TankType,
    color: TankColor,
    rotation: Rotation,
    frameNumber = 1,
  ): string {
    const parts = [
      SPRITE_TANK_PREFIX,
      type.party.toString(),
      color.toString(),
      type.tier.toString(),
      this.getRotationString(rotation),
      frameNumber.toString(),
    ];

    const spriteId = parts.join(SPRITE_ID_SEPARATOR);

    return spriteId;
  }

  private static getRotationString(rotation: Rotation): string {
    switch (rotation) {
      case Rotation.Up:
        return 'up';
      case Rotation.Down:
        return 'down';
      case Rotation.Left:
        return 'left';
      case Rotation.Right:
        return 'right';
      default:
        return 'unknown';
    }
  }
}
