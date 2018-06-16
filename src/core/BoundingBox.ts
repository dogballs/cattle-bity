import Vector from './Vector';

class BoundingBox {
  public min: Vector;
  public max: Vector;

  /**
   * Creates a rectangular box which captures entire object bounds
   * @param  {Vector} min Top-left point of the box
   * @param  {Vector} max Bottom-right point of the box
   * @return {BoundingBox}
   */
  constructor(min = new Vector(), max = new Vector()) {
    this.min = min;
    this.max = max;
  }

  public getCenter() {
    return this.min.clone().add(this.max).divideScalar(2);
  }

  /**
   * Tells if current bounding box intersects another one
   * @param  {BoundingBox} box
   * @return {Boolean}
   */
  public intersectsBox(box) {
    const isOutside = (
      this.max.x <= box.min.x ||
      this.min.x >= box.max.x ||
      this.max.y <= box.min.y ||
      this.min.y >= box.max.y
    );

    return !isOutside;
  }
}

export default BoundingBox;
