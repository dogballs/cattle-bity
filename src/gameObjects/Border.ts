import { GameObject } from '../core';
import {
  BORDER_LEFT_WIDTH,
  BORDER_RIGHT_WIDTH,
  BORDER_TOP_BOTTOM_HEIGHT,
  FIELD_SIZE,
} from '../config';

import { BorderWall } from './BorderWall';

export class Border extends GameObject {
  constructor() {
    super();

    const topBorder = new BorderWall(
      BORDER_LEFT_WIDTH + FIELD_SIZE + BORDER_RIGHT_WIDTH,
      BORDER_TOP_BOTTOM_HEIGHT,
    );
    topBorder.position.set(0, 0);
    this.add(topBorder);

    const bottomBorder = new BorderWall(
      BORDER_LEFT_WIDTH + FIELD_SIZE + BORDER_RIGHT_WIDTH,
      BORDER_TOP_BOTTOM_HEIGHT,
    );
    bottomBorder.position.set(0, FIELD_SIZE + BORDER_TOP_BOTTOM_HEIGHT);
    this.add(bottomBorder);

    const leftBorder = new BorderWall(BORDER_LEFT_WIDTH, FIELD_SIZE);
    leftBorder.position.set(0, BORDER_TOP_BOTTOM_HEIGHT);
    this.add(leftBorder);

    const rightBorder = new BorderWall(BORDER_RIGHT_WIDTH, FIELD_SIZE);
    rightBorder.position.set(
      BORDER_LEFT_WIDTH + FIELD_SIZE,
      BORDER_TOP_BOTTOM_HEIGHT,
    );
    this.add(rightBorder);
  }
}
