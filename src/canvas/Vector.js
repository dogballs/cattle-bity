class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(x = 0, y = 0) {
    this.x += x;
    this.y += y;

    return this;
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}

export default Vector;
