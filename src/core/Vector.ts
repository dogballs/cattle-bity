class Vector {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  public sub(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  public divideScalar(s) {
    this.x /= s;
    this.y /= s;

    return this;
  }

  public clone() {
    return new Vector(this.x, this.y);
  }

  public set(x, y) {
    this.x = x;
    this.y = y;

    return this;
  }

  public setX(x) {
    this.x = x;

    return this;
  }

  public setY(y) {
    this.y = y;

    return this;
  }
}

export default Vector;
