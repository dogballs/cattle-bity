import { GameObject } from '../core';
import * as config from '../config';

import { BorderWall } from './BorderWall';

export class Border extends GameObject {
  constructor() {
    super();

    const innerLength = config.FIELD_SIZE;
    const hDepth = config.BORDER_H_DEPTH;
    const vDepth = config.BORDER_V_DEPTH;

    const topBorder = new BorderWall(innerLength + hDepth * 2, vDepth);
    topBorder.position.set(0, 0);
    this.add(topBorder);

    const bottomBorder = new BorderWall(innerLength + hDepth * 2, vDepth);
    bottomBorder.position.set(0, innerLength + vDepth);
    this.add(bottomBorder);

    const leftBorder = new BorderWall(hDepth, innerLength);
    leftBorder.position.set(0, vDepth);
    this.add(leftBorder);

    const rightBorder = new BorderWall(hDepth, innerLength);
    rightBorder.position.set(hDepth + innerLength, vDepth);
    this.add(rightBorder);
  }
}
