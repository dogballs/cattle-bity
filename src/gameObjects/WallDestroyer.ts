import { GameObject } from '../core';
import { Tag } from '../game';
import * as config from '../config';

const MAX_DAMAGE = 2;

export class WallDestroyer extends GameObject {
  public readonly collider;
  public readonly damage: number;

  constructor(argDamage: number) {
    const damage = Math.min(argDamage, MAX_DAMAGE);

    const width = config.TILE_SIZE_LARGE;
    const depth = config.TILE_SIZE_SMALL * damage;

    super(width, depth);

    this.damage = damage;
    this.collider = true;
  }

  public collide(target: GameObject): void {
    const isBrickWall =
      target.tags.includes(Tag.Wall) && target.tags.includes(Tag.Brick);
    const isSteelWall =
      target.tags.includes(Tag.Wall) && target.tags.includes(Tag.Steel);

    if (isBrickWall || (isSteelWall && this.damage === 2)) {
      target.removeSelf();
      this.removeSelf();
    }
  }
}
