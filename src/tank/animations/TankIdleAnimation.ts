import { Animation, Rotation, Rect, Sprite } from '../../core';

import { TankColor } from '../TankColor';
import { TankParty } from '../TankParty';
import { TankTier } from '../TankTier';
import { TankSpriteFactory } from '../TankSpriteFactory';

export class TankIdleAnimation extends Animation<Sprite> {
  constructor(
    party: TankParty,
    color: TankColor,
    tier: TankTier,
    targetRect: Rect,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frameNumber = 1;

    const frames = [
      TankSpriteFactory.create(
        party,
        color,
        tier,
        targetRect,
        rotation,
        frameNumber,
      ),
    ];

    if (hasDrop) {
      const dropColor = TankColor.Danger;
      frames.push(
        TankSpriteFactory.create(
          party,
          dropColor,
          tier,
          targetRect,
          rotation,
          frameNumber,
        ),
      );
    }

    super(frames, { delay: 7, loop: true });
  }
}
