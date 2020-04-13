import { BoundingBox } from '../BoundingBox';

import { Collider } from './Collider';

export class CollisionContact {
  public readonly collider: Collider;
  public readonly box: BoundingBox;

  constructor(collider: Collider, box: BoundingBox) {
    this.collider = collider;
    this.box = box;
  }
}
