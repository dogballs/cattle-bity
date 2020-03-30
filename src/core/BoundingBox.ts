import { Rect } from './Rect';
import { Size } from './Size';
import { Vector } from './Vector';

/**
 * Axis-aligned boudning box (AABB)
 */
export class BoundingBox {
  public min: Vector;
  public max: Vector;

  constructor(min = new Vector(), max = new Vector()) {
    this.min = min;
    this.max = max;
  }

  public getCenter(): Vector {
    return this.min
      .clone()
      .add(this.max)
      .divideScalar(2);
  }

  public getSize(): Size {
    const width = this.max.x - this.min.x;
    const height = this.max.y - this.min.y;
    const size = new Size(width, height);

    return size;
  }

  public toRect(): Rect {
    return new Rect(
      this.min.x,
      this.min.y,
      this.max.x - this.min.x,
      this.max.y - this.min.y,
    );
  }

  public computeIntersectionBox(other: BoundingBox): BoundingBox {
    const minX = Math.max(this.min.x, other.min.x);
    const maxX = Math.min(this.max.x, other.max.x);
    const minY = Math.max(this.min.y, other.min.y);
    const maxY = Math.min(this.max.y, other.max.y);

    const min = new Vector(minX, minY);
    const max = new Vector(maxX, maxY);

    const intersectionBox = new BoundingBox(min, max);

    return intersectionBox;
  }

  public intersectsBox(other: BoundingBox): boolean {
    const isOutside =
      this.max.x <= other.min.x ||
      this.min.x >= other.max.x ||
      this.max.y <= other.min.y ||
      this.min.y >= other.max.y;

    return !isOutside;
  }

  public containsPoint(p: Vector): boolean {
    const isOutside =
      this.max.x <= p.x ||
      this.min.x >= p.x ||
      this.max.y <= p.y ||
      this.min.y >= p.y;

    return !isOutside;
  }

  public fromPoints(points: Vector[]): this {
    if (points.length === 0) {
      return this;
    }

    this.min.copyFrom(points[0]);
    this.max.copyFrom(points[0]);

    for (const point of points) {
      if (point.x < this.min.x) {
        this.min.x = point.x;
      }
      if (point.x > this.max.x) {
        this.max.x = point.x;
      }
      if (point.y < this.min.y) {
        this.min.y = point.y;
      }
      if (point.y > this.max.y) {
        this.max.y = point.y;
      }
    }

    return this;
  }
}
