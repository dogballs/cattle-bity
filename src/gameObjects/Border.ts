import { GameObject } from '../core';
import * as config from '../config';

import { BorderWall } from './BorderWall';

export class Border extends GameObject {
  protected setup(): void {
    config.BORDER_RECTS.forEach((rect) => {
      const wall = new BorderWall(rect.width, rect.height);
      wall.position.set(rect.x, rect.y);
      this.add(wall);
    });
  }
}
