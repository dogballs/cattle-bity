import { BoundingBox } from '../BoundingBox';
import { GameObject } from '../GameObject';

export class Collision {
  public readonly self: GameObject;
  public readonly other: GameObject;
  public readonly intersectionBox: BoundingBox;

  constructor(
    self: GameObject,
    other: GameObject,
    intersectionBox: BoundingBox,
  ) {
    this.self = self;
    this.other = other;
    this.intersectionBox = intersectionBox;
  }
}
