import { GameObject } from './../core';

import { Tag } from '../Tag';

export class BrickWallDestroyer extends GameObject {
  public collider = true;

  constructor() {
    super(64, 16);
  }

  public collide(target: GameObject): void {
    const isBrickWall =
      target.tags.includes(Tag.Wall) && target.tags.includes(Tag.Brick);

    if (isBrickWall) {
      target.removeSelf();
      this.removeSelf();
    }
  }
}
