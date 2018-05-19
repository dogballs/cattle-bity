import Vector from './Vector.js';

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.vectors = [
      new Vector(0, 0),
      new Vector(this.width, 0),
      new Vector(this.width, this.height),
      new Vector(0, this.height),
    ];

    this.position = new Vector(0, 0);
  }

  getPositionedVectors() {
    const positionedVectors = this.vectors.map((vector) => {
      const positionedVector = vector.clone();

      positionedVector.add(this.position);

      return positionedVector;
    });

    return positionedVectors;
  }
}

export default Rectangle;
