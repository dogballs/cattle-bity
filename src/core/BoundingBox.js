import Vector from './Vector.js';

class BoundingBox {
  /**
   * Creates bounding box
   * @param  {Vector} min Top-left point of the box
   * @param  {Vector} max Bottom-right point of the box
   * @return {BoundingBox}
   */
  constructor(min = new Vector(), max = new Vector()) {
    this.min = min;
    this.max = max;
  }

  intersectsBox(box) {
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
