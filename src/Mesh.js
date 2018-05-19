import Vector from './Vector.js';

class Mesh {
  constructor(width, height, material) {
    this.width = width;
    this.height = height;

    this.material = material;

    this.position = new Vector(0, 0);
  }
}

export default Mesh;
