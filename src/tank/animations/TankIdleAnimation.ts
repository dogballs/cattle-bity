import { Animation, Sprite, SpriteLoader } from '../../core';
import { Rotation } from '../../game';

import { TankColor } from '../TankColor';
import { TankType } from '../TankType';
import { TankSpriteId } from '../TankSpriteId';

export class TankIdleAnimation extends Animation<Sprite> {
  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frameNumber = 1;

    const frames = spriteLoader.loadList([
      TankSpriteId.create(type, rotation, frameNumber),
    ]);

    if (hasDrop) {
      const dropType = type.clone().setColor(TankColor.Danger);

      const dropFrames = spriteLoader.loadList([
        TankSpriteId.create(dropType, rotation, frameNumber),
      ]);

      frames.push(...dropFrames);
    }

    super(frames, { delay: 7, loop: true });
  }
}
