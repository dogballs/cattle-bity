import { Animation, Rotation, Rect, Sprite, SpriteLoader } from '../../core';

import { TankColor } from '../TankColor';
import { TankType } from '../TankType';
import { TankSpriteFactory } from '../TankSpriteFactory';

export class TankMoveAnimation extends Animation<Sprite> {
  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    targetRect: Rect,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frames = [
      TankSpriteFactory.create(spriteLoader, type, targetRect, rotation, 1),
      TankSpriteFactory.create(spriteLoader, type, targetRect, rotation, 2),
      TankSpriteFactory.create(spriteLoader, type, targetRect, rotation, 1),
      TankSpriteFactory.create(spriteLoader, type, targetRect, rotation, 2),
    ];

    if (hasDrop) {
      const dropType = type.clone().setColor(TankColor.Danger);
      frames.push(
        TankSpriteFactory.create(
          spriteLoader,
          dropType,
          targetRect,
          rotation,
          1,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          spriteLoader,
          dropType,
          targetRect,
          rotation,
          2,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          spriteLoader,
          dropType,
          targetRect,
          rotation,
          1,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          spriteLoader,
          dropType,
          targetRect,
          rotation,
          2,
        ),
      );
    }

    super(frames, { delay: 1, loop: true });
  }
}
