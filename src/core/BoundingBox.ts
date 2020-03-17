import { Rect } from './Rect';
import { Size } from './Size';
import { Vector } from './Vector';

export class BoundingBox {
  public min: Vector;
  public max: Vector;

  /**
   * Creates a rectangular box which captures entire object bounds (AABB)
   * @param  {Vector} min Top-left point of the box
   * @param  {Vector} max Bottom-right point of the box
   * @return {BoundingBox}
   */
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

  /**
   * Tells if current bounding box intersects another one
   * @param  {BoundingBox} box
   * @return {Boolean}
   */
  public intersectsBox(box: BoundingBox): boolean {
    const isOutside =
      this.max.x <= box.min.x ||
      this.min.x >= box.max.x ||
      this.max.y <= box.min.y ||
      this.min.y >= box.max.y;

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
