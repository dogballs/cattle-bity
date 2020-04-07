import { Animation, SpriteLoader } from '../../core';
import { Rotation } from '../../game';

import { TankAnimationFrame } from '../TankAnimationFrame';
import { TankColor } from '../TankColor';
import { TankParty } from '../TankParty';
import { TankType } from '../TankType';

export class TankMoveAnimation extends Animation<TankAnimationFrame> {
  private type: TankType;
  private regularFrames: TankAnimationFrame[] = [];
  private dropFrames: TankAnimationFrame[] = [];

  constructor(
    spriteLoader: SpriteLoader,
    type: TankType,
    colors: TankColor[],
    rotation: Rotation,
  ) {
    super([], { delay: 0.02, loop: true });

    this.type = type;

    this.regularFrames = [
      new TankAnimationFrame(spriteLoader, type, colors, rotation, 1),
      new TankAnimationFrame(spriteLoader, type, colors, rotation, 2),
      new TankAnimationFrame(spriteLoader, type, colors, rotation, 1),
      new TankAnimationFrame(spriteLoader, type, colors, rotation, 2),
    ];

    // Only enemy has drop now
    if (type.party === TankParty.Enemy) {
      const dropColors = [TankColor.Danger];

      this.dropFrames = [
        new TankAnimationFrame(spriteLoader, type, dropColors, rotation, 1),
        new TankAnimationFrame(spriteLoader, type, dropColors, rotation, 2),
        new TankAnimationFrame(spriteLoader, type, dropColors, rotation, 1),
        new TankAnimationFrame(spriteLoader, type, dropColors, rotation, 2),
      ];
    }

    this.updateFrames();
  }

  // Tank might lose his drop, use it remove drop animation frames
  public updateFrames(): void {
    const frames = [...this.regularFrames];
    if (this.type.hasDrop) {
      frames.push(...this.dropFrames);
    }

    this.resetWithFrames(frames);
  }
}
