import Vector from './Vector.js';

class BoundingBox {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    // Top-left point of the box
    this.min = new Vector(x, y);
    // Bottom-right point of the box
    this.max = this.min.clone().add(width, height);
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
