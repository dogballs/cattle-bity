export class Vector {
  public x: number;
  public y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  public setX(x: number) {
    this.x = x;

    return this;
  }

  public setY(y: number) {
    this.y = y;

    return this;
  }

  public add(v: Vector) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  public sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  public divideScalar(s: number) {
    this.x /= s;
    this.y /= s;

    return this;
  }

  public clone() {
    return new Vector(this.x, this.y);
  }
}
