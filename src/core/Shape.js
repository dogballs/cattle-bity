import BoundingBox from './BoundingBox.js';
import Vector from './Vector.js';

class Shape {
  constructor() {
    this.fillColor = '#000';
    this.position = new Vector(0, 0);
    this.vectors = [];
  }

  getBoundingBox() {
    const xs = this.vectors.map(v => v.x);
    const ys = this.vectors.map(v => v.y);

    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);

    const min = this.position.clone().add(minX, minY);
    const max = this.position.clone().add(maxX, maxY);

    return new BoundingBox(min, max);
  }

  render() {
    return {
      fillColor: this.fillColor,
      position: this.position,
      vectors: this.vectors,
    };
  }
}

export default Shape;
