import { Animation, Sprite, SpriteLoader } from '../../core';
import { Rotation } from '../../game';

import { TankColor } from '../TankColor';
import { TankType } from '../TankType';
import { TankSpriteId } from '../TankSpriteId';

export class TankMoveAnimation extends Animation<Sprite> {
  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    rotation: Rotation,
    hasDrop = false,
  ) {
    const frames = spriteLoader.loadList([
      TankSpriteId.create(type, rotation, 1),
      TankSpriteId.create(type, rotation, 2),
      TankSpriteId.create(type, rotation, 1),
      TankSpriteId.create(type, rotation, 2),
    ]);

    if (hasDrop) {
      const dropType = type.clone().setColor(TankColor.Danger);

      const dropFrames = spriteLoader.loadList([
        TankSpriteId.create(dropType, rotation, 1),
        TankSpriteId.create(dropType, rotation, 2),
        TankSpriteId.create(dropType, rotation, 1),
        TankSpriteId.create(dropType, rotation, 2),
      ]);

      frames.push(...dropFrames);
    }

    super(frames, { delay: 1, loop: true });
  }
}
