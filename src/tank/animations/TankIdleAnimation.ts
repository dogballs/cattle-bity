import { Animation, Rotation, Rect, Sprite, SpriteLoader } from '../../core';

import { TankColor } from '../TankColor';
import { TankType } from '../TankType';
import { TankSpriteFactory } from '../TankSpriteFactory';

export class TankIdleAnimation extends Animation<Sprite> {
  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    targetRect: Rect,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frameNumber = 1;

    const frames = [
      TankSpriteFactory.create(
        spriteLoader,
        type,
        targetRect,
        rotation,
        frameNumber,
      ),
    ];

    if (hasDrop) {
      const dropType = type.clone().setColor(TankColor.Danger);
      frames.push(
        TankSpriteFactory.create(
          spriteLoader,
          dropType,
          targetRect,
          rotation,
          frameNumber,
        ),
      );
    }

    super(frames, { delay: 7, loop: true });
  }
}
