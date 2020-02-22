import { Animation, Rotation, Rect, Sprite } from '../../core';

import { TankColor } from '../TankColor';
import { TankParty } from '../TankParty';
import { TankTier } from '../TankTier';
import { TankSpriteFactory } from '../TankSpriteFactory';

export class TankMoveAnimation extends Animation<Sprite> {
  constructor(
    party: TankParty,
    color: TankColor,
    tier: TankTier,
    targetRect: Rect,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frames = [
      TankSpriteFactory.create(party, color, tier, targetRect, rotation, 1),
      TankSpriteFactory.create(party, color, tier, targetRect, rotation, 2),
      TankSpriteFactory.create(party, color, tier, targetRect, rotation, 1),
      TankSpriteFactory.create(party, color, tier, targetRect, rotation, 2),
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
          1,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          party,
          dropColor,
          tier,
          targetRect,
          rotation,
          2,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          party,
          dropColor,
          tier,
          targetRect,
          rotation,
          1,
        ),
      );
      frames.push(
        TankSpriteFactory.create(
          party,
          dropColor,
          tier,
          targetRect,
          rotation,
          2,
        ),
      );
    }

    super(frames, { delay: 1, loop: true });
  }
}
