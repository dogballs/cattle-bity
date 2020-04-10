import { GameObject } from '../../core';
import { Tag } from '../../game';
import * as config from '../../config';

import { BorderWall } from '../BorderWall';

export class EditorBorder extends GameObject {
  protected setup(): void {
    config.BORDER_RECTS.forEach((rect) => {
      const wall = new BorderWall(rect.width, rect.height);
      wall.tags = [Tag.EditorBlockMove];
      wall.position.set(rect.x, rect.y);
      this.add(wall);
    });
  }
}
